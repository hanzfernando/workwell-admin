using Google.Cloud.Firestore;
using WorkWell.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;

namespace WorkWell.Server.Services
{
    public class RoutineService
    {
        private readonly FirestoreDb _firestoreDb;

        public RoutineService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Add a new routine
        public async Task<Routine?> AddRoutineAsync(Routine routine, bool isUnique = false, string? patientId = null)
        {
            try
            {
                var docRef = _firestoreDb.Collection("routines").Document();
                routine.RoutineId = docRef.Id;

                // Save the new routine in Firestore
                await docRef.SetAsync(routine);

                // If routine is unique, ensure the user (patient) gets assigned
                if (isUnique && !string.IsNullOrEmpty(patientId))
                {
                    var userDocRef = _firestoreDb.Collection("users").Document(patientId);
                    var userSnapshot = await userDocRef.GetSnapshotAsync();

                    if (!userSnapshot.Exists)
                    {
                        throw new Exception($"User with ID {patientId} not found.");
                    }

                    var user = userSnapshot.ConvertTo<User>();

                    // Add the new Routine ID to the user's routines list
                    if (!user.Routines.Contains(routine.RoutineId))
                    {
                        user.Routines.Add(routine.RoutineId);

                        await userDocRef.UpdateAsync("Routines", user.Routines);
                    }
                }

                return routine; // ✅ Return the created routine instead of the user
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding routine: {ex.Message}");
                throw new Exception("Failed to add routine. Please try again later.");
            }
        }





        // Get a specific routine by ID and ensure it was created by the requesting user
        public async Task<Routine?> GetRoutineAsync(string routineId, string organizationId, string uid)
        {
            try
            {
                Debug.WriteLine("Get ALl Routines");

                var docRef = _firestoreDb.Collection("routines").Document(routineId);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists) return null;

                var routine = snapshot.ConvertTo<Routine>();

                // Ensure the routine belongs to the same organization and was created by the user
                return (routine.OrganizationId == organizationId && routine.CreatedBy == uid) ? routine : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching routine with ID {routineId}: {ex.Message}");
                throw new Exception("Failed to fetch routine. Please try again later.");
            }
        }

        // Get all routines created by the authenticated user
        public async Task<IEnumerable<Routine>> GetAllRoutinesAsync(string organizationId, string uid)
        {
            try
            {
                var query = _firestoreDb.Collection("routines")
                                        .WhereEqualTo("OrganizationId", organizationId)
                                        .WhereEqualTo("CreatedBy", uid);

                var snapshot = await query.GetSnapshotAsync();
                return snapshot.Documents.Select(doc => doc.ConvertTo<Routine>()).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching all routines: {ex.Message}");
                throw new Exception("Failed to fetch routines. Please try again later.");
            }
        }

        // Get all routines created by the authenticated user
        public async Task<IEnumerable<Routine>> GetAllOrganizationRoutinesAsync(string organizationId)
        {
            try
            {

                var query = _firestoreDb.Collection("routines")
                                        .WhereEqualTo("OrganizationId", organizationId);

                var snapshot = await query.GetSnapshotAsync();
                return snapshot.Documents.Select(doc => doc.ConvertTo<Routine>()).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching all routines: {ex.Message}");
                throw new Exception("Failed to fetch routines. Please try again later.");
            }
        }

        // Update an existing routine
        public async Task UpdateRoutineAsync(Routine routine)
        {
            try
            {
                var docRef = _firestoreDb.Collection("routines").Document(routine.RoutineId);
                await docRef.SetAsync(routine, SetOptions.Overwrite);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating routine with ID {routine.RoutineId}: {ex.Message}");
                throw new Exception("Failed to update routine. Please try again later.");
            }
        }

        public async Task<bool> DeleteRoutineAsync(string routineId, string organizationId)
        {
            var routineRef = _firestoreDb.Collection("routines").Document(routineId);
            var snapshot = await routineRef.GetSnapshotAsync();

            if (!snapshot.Exists) return false;

            var routine = snapshot.ConvertTo<Routine>();

            if (routine.OrganizationId != organizationId)
                throw new UnauthorizedAccessException("You are not authorized to delete this routine.");

            // 🔑 Remove routine from all assigned users.
            foreach (var userId in routine.Users ?? new List<string>())
            {
                var userRef = _firestoreDb.Collection("users").Document(userId);
                var userSnapshot = await userRef.GetSnapshotAsync();

                if (userSnapshot.Exists)
                {
                    var user = userSnapshot.ConvertTo<User>();
                    user.Routines = user.Routines?.Where(rid => rid != routineId).ToList() ?? new List<string>();
                    await userRef.UpdateAsync("Routines", user.Routines);
                }
            }

            // 🔑 Clear users before deletion.
            await routineRef.UpdateAsync("Users", new List<string>());

            // 🔑 Delete the routine.
            await routineRef.DeleteAsync();
            return true;
        }


        public async Task<bool> RemoveUserFromRoutineAsync(string routineId, string userId, string organizationId)
        {
            var routineRef = _firestoreDb.Collection("routines").Document(routineId);
            var routineSnapshot = await routineRef.GetSnapshotAsync();

            if (!routineSnapshot.Exists) return false;

            var routine = routineSnapshot.ConvertTo<Routine>();

            // Ensure the routine belongs to the organization.
            if (routine.OrganizationId != organizationId)
                throw new UnauthorizedAccessException("You are not authorized to modify this routine.");

            // Remove user from routine's Users array.
            routine.Users = routine.Users?.Where(uid => uid != userId).ToList() ?? new List<string>();
            await routineRef.UpdateAsync("Users", routine.Users);

            // 🔑 Remove routine from the user's Routines array.
            var userRef = _firestoreDb.Collection("users").Document(userId);
            var userSnapshot = await userRef.GetSnapshotAsync();

            if (userSnapshot.Exists)
            {
                var user = userSnapshot.ConvertTo<User>();
                user.Routines = user.Routines?.Where(rid => rid != routineId).ToList() ?? new List<string>();
                await userRef.UpdateAsync("Routines", user.Routines);
            }

            return true;
        }


        public async Task AssignUsersToRoutineAsync(string routineId, List<string> userIds, string organizationId)
        {
            try
            {
                var routineRef = _firestoreDb.Collection("routines").Document(routineId);
                var routineSnapshot = await routineRef.GetSnapshotAsync();

                if (!routineSnapshot.Exists)
                    throw new Exception("Routine not found.");

                var routine = routineSnapshot.ConvertTo<Routine>();

                // Ensure the routine belongs to the organization
                if (routine.OrganizationId != organizationId)
                    throw new UnauthorizedAccessException("Routine does not belong to your organization.");

                // Current assigned users
                var previousUserIds = routine.Users ?? new List<string>();

                // Find users being removed
                var removedUserIds = previousUserIds.Except(userIds).ToList();

                // Update routine's Users field (empty array if clearing)
                routine.Users = userIds;
                await routineRef.SetAsync(routine, SetOptions.Overwrite);

                // Remove routine from users who were previously assigned
                foreach (var removedUserId in removedUserIds)
                {
                    var userRef = _firestoreDb.Collection("users").Document(removedUserId);
                    var userSnapshot = await userRef.GetSnapshotAsync();

                    if (userSnapshot.Exists)
                    {
                        var user = userSnapshot.ConvertTo<User>();

                        if (user.Routines.Contains(routineId))
                        {
                            user.Routines.Remove(routineId);
                            await userRef.UpdateAsync("Routines", user.Routines);
                        }
                    }
                }

                // Assign routine to newly assigned users (if any)
                foreach (var userId in userIds)
                {
                    var userRef = _firestoreDb.Collection("users").Document(userId);
                    var userSnapshot = await userRef.GetSnapshotAsync();

                    if (!userSnapshot.Exists)
                        throw new Exception($"User with ID {userId} not found.");

                    var user = userSnapshot.ConvertTo<User>();

                    if (!user.Routines.Contains(routineId))
                    {
                        user.Routines.Add(routineId);
                        await userRef.UpdateAsync("Routines", user.Routines);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error assigning users to routine {routineId}: {ex.Message}");
                throw new Exception("Failed to assign users to routine. Please try again later.");
            }
        }


    }
}
