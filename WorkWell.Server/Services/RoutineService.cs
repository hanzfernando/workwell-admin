using Google.Cloud.Firestore;
using WorkWell.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkWell.Server.Models.WorkWell.Server.Models;

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
                // Create a new document reference with a unique ID
                var docRef = _firestoreDb.Collection("routines").Document();
                routine.RoutineId = docRef.Id; // Assign the generated document ID to the routine

                Console.WriteLine($"Adding routine with ID: {routine.RoutineId}");

                // Save the routine to Firestore
                await docRef.SetAsync(routine);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding routine: {ex.Message}");
                throw new Exception("Failed to add routine. Please try again later.");
            }
        }

        // GET /api/routines/:id
        public async Task<Routine?> GetRoutineAsync(string routineId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("routines").Document(routineId);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists) return null;

                return snapshot.ConvertTo<Routine>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching routine with ID {routineId}: {ex.Message}");
                throw new Exception("Failed to fetch routine. Please try again later.");
            }
        }

        // GET /api/routines
        public async Task<IEnumerable<Routine>> GetAllRoutinesAsync()
        {
            try
            {
                var query = _firestoreDb.Collection("routines");
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
        public async Task AssignUsersToRoutineAsync(string routineId, List<string> userIds)
        {
            try
            {
                var routineRef = _firestoreDb.Collection("routines").Document(routineId);
                var routineSnapshot = await routineRef.GetSnapshotAsync();

                if (!routineSnapshot.Exists) throw new Exception("Routine not found.");

                var routine = routineSnapshot.ConvertTo<Routine>();

                // Update the routine's Users list (allow empty list to unassign everyone)
                routine.Users = userIds;
                await routineRef.SetAsync(routine, SetOptions.Overwrite);

                // Clear each user's Routines list if unassigned
                if (userIds.Count == 0)
                {
                    // Remove this routine from all users
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
                    // Update each user's Routines list
                    foreach (var userId in userIds)
                    {
                        var userRef = _firestoreDb.Collection("users").Document(userId);
                        var userSnapshot = await userRef.GetSnapshotAsync();

                        if (!userSnapshot.Exists) throw new Exception($"User {userId} not found.");

                        var user = userSnapshot.ConvertTo<User>();

                        if (!user.Routines.Contains(routineId))
                        {
                            user.Routines.Add(routineId);
                            await userRef.SetAsync(user, SetOptions.Overwrite);
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
