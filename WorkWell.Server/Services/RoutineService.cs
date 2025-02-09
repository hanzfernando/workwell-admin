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

        // Delete a routine
        public async Task DeleteRoutineAsync(string routineId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("routines").Document(routineId);
                await docRef.DeleteAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting routine with ID {routineId}: {ex.Message}");
                throw new Exception("Failed to delete routine. Please try again later.");
            }
        }

        // Assign users to a routine
        public async Task AssignUsersToRoutineAsync(string routineId, List<string> userIds, string organizationId)
        {
            try
            {
                var routineRef = _firestoreDb.Collection("routines").Document(routineId);
                var routineSnapshot = await routineRef.GetSnapshotAsync();

                if (!routineSnapshot.Exists) throw new Exception("Routine not found.");

                var routine = routineSnapshot.ConvertTo<Routine>();

                // Ensure the routine belongs to the requesting user's organization
                if (routine.OrganizationId != organizationId)
                {
                    throw new UnauthorizedAccessException("Routine does not belong to your organization.");
                }

                // Get users currently assigned to this routine
                var previousUserIds = routine.Users ?? new List<string>();

                // Find users who are being removed
                var removedUserIds = previousUserIds.Except(userIds).ToList();

                // Update the routine's Users field (assign new user list)
                routine.Users = userIds;
                await routineRef.SetAsync(routine, SetOptions.Overwrite);

                // Remove routine from users who were removed
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

                // Assign routine to newly assigned users
                foreach (var userId in userIds)
                {
                    var userRef = _firestoreDb.Collection("users").Document(userId);
                    var userSnapshot = await userRef.GetSnapshotAsync();

                    if (!userSnapshot.Exists) throw new Exception($"User with ID {userId} not found.");

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
