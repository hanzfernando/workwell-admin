using Google.Cloud.Firestore;
using WorkWell.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorkWell.Server.Services
{
    public class RoutineService
    {
        private readonly FirestoreDb _firestoreDb;

        public RoutineService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // POST /api/routines
        public async Task AddRoutineAsync(Routine routine)
        {
            try
            {
                var docRef = _firestoreDb.Collection("routines").Document();
                routine.RoutineId = docRef.Id;
                await docRef.SetAsync(routine);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding routine: {ex.Message}");
                throw new Exception("Failed to add routine. Please try again later.");
            }
        }

        // GET /api/routines/:id
        public async Task<Routine?> GetRoutineAsync(string routineId, string organizationId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("routines").Document(routineId);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists) return null;

                var routine = snapshot.ConvertTo<Routine>();

                // Verify organizationId matches
                return routine.OrganizationId == organizationId ? routine : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching routine with ID {routineId}: {ex.Message}");
                throw new Exception("Failed to fetch routine. Please try again later.");
            }
        }

        // GET /api/routines
        public async Task<IEnumerable<Routine>> GetAllRoutinesAsync(string organizationId)
        {
            try
            {
                var query = _firestoreDb.Collection("routines").WhereEqualTo("OrganizationId", organizationId);
                var snapshot = await query.GetSnapshotAsync();
                return snapshot.Documents.Select(doc => doc.ConvertTo<Routine>()).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching all routines: {ex.Message}");
                throw new Exception("Failed to fetch routines. Please try again later.");
            }
        }

        // PUT /api/routines/:id
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

        // DELETE /api/routines/:id
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

        // PATCH /api/routines/:id/assign-users
        public async Task AssignUsersToRoutineAsync(string routineId, List<string> userIds, string organizationId)
        {
            try
            {
                var routineRef = _firestoreDb.Collection("routines").Document(routineId);
                var routineSnapshot = await routineRef.GetSnapshotAsync();

                if (!routineSnapshot.Exists) throw new Exception("Routine not found.");

                var routine = routineSnapshot.ConvertTo<Routine>();

                // Verify organizationId matches
                if (routine.OrganizationId != organizationId)
                {
                    throw new UnauthorizedAccessException("Routine does not belong to your organization.");
                }

                // Update the routine's Users field
                routine.Users = userIds;
                await routineRef.SetAsync(routine, SetOptions.Overwrite);

                // Maintain reverse mapping in user documents
                if (userIds.Count == 0)
                {
                    // Remove this routine from all users previously assigned to it
                    var userQuery = _firestoreDb.Collection("users")
                                                .WhereArrayContains("Routines", routineId);
                    var userSnapshots = await userQuery.GetSnapshotAsync();

                    foreach (var userDoc in userSnapshots.Documents)
                    {
                        var user = userDoc.ConvertTo<User>();
                        user.Routines.Remove(routineId);
                        await _firestoreDb.Collection("users").Document(userDoc.Id).SetAsync(user, SetOptions.Overwrite);
                    }
                }
                else
                {
                    // Update each user's Routines list to include this routine
                    foreach (var userId in userIds)
                    {
                        var userRef = _firestoreDb.Collection("users").Document(userId);
                        var userSnapshot = await userRef.GetSnapshotAsync();

                        if (!userSnapshot.Exists)
                        {
                            throw new Exception($"User with ID {userId} not found.");
                        }

                        var user = userSnapshot.ConvertTo<User>();

                        if (!user.Routines.Contains(routineId))
                        {
                            user.Routines.Add(routineId);
                            await userRef.SetAsync(user, SetOptions.Overwrite);
                        }
                    }

                    // Clean up users no longer assigned to this routine
                    var oldUserQuery = _firestoreDb.Collection("users")
                                                   .WhereArrayContains("Routines", routineId);
                    var oldUserSnapshots = await oldUserQuery.GetSnapshotAsync();

                    foreach (var userDoc in oldUserSnapshots.Documents)
                    {
                        if (!userIds.Contains(userDoc.Id))
                        {
                            var user = userDoc.ConvertTo<User>();
                            user.Routines.Remove(routineId);
                            await _firestoreDb.Collection("users").Document(userDoc.Id).SetAsync(user, SetOptions.Overwrite);
                        }
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
