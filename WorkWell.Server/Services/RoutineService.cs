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

                // Populate additional details after saving the routine
                routine = await PopulateAssignedUserDetailsAsync(routine);
                routine = await PopulateExerciseDetailsAsync(routine);

                // Update Firestore with the populated routine
                await docRef.SetAsync(routine, SetOptions.Overwrite);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding routine: {ex.Message}");
                Console.WriteLine($"Error adding routine: {ex.StackTrace}");
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

                var routine = snapshot.ConvertTo<Routine>();
                routine = await PopulateAssignedUserDetailsAsync(routine);
                return await PopulateExerciseDetailsAsync(routine);
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
                var routines = snapshot.Documents.Select(doc => doc.ConvertTo<Routine>()).ToList();

                // Populate user and exercise details for each routine
                var tasks = routines.Select(async routine =>
                {
                    routine = await PopulateAssignedUserDetailsAsync(routine);
                    return await PopulateExerciseDetailsAsync(routine);
                });

                return await Task.WhenAll(tasks); // Populate details in parallel
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

        // Helper Method: Populate Assigned User Details
        private async Task<Routine> PopulateAssignedUserDetailsAsync(Routine routine)
        {
            if (string.IsNullOrEmpty(routine.AssignedTo))
                return routine; // No user assigned, skip population

            try
            {
                var userDocRef = _firestoreDb.Collection("users").Document(routine.AssignedTo);
                var userSnapshot = await userDocRef.GetSnapshotAsync();

                if (userSnapshot.Exists)
                {
                    var user = userSnapshot.ConvertTo<User>();
                    routine.AssignedName = $"{user.FirstName} {user.LastName}";
                }
                else
                {
                    Console.WriteLine($"User with UID {routine.AssignedTo} not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error populating user details for UID {routine.AssignedTo}: {ex.Message}");
            }

            return routine;
        }

        // Helper Method: Populate Exercise Details for Each Exercise in the Routine
        private async Task<Routine> PopulateExerciseDetailsAsync(Routine routine)
        {
            foreach (var routineExercise in routine.Exercises)
            {
                try
                {
                    var exerciseDocRef = _firestoreDb.Collection("exercises").Document(routineExercise.ExerciseId);
                    var exerciseSnapshot = await exerciseDocRef.GetSnapshotAsync();

                    if (exerciseSnapshot.Exists)
                    {
                        var exercise = exerciseSnapshot.ConvertTo<Exercise>();
                        routineExercise.ExerciseName = exercise.Name;
                        routineExercise.ExerciseDescription = exercise.Description;
                    }
                    else
                    {
                        Console.WriteLine($"Exercise with ID {routineExercise.ExerciseId} not found.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error populating exercise details for ID {routineExercise.ExerciseId}: {ex.Message}");
                }
            }

            return routine;
        }

        // PATCH /api/routines/{id}/assign
        public async Task UpdateAssignedUserAsync(string routineId, string assignedTo)
        {
            try
            {
                var docRef = _firestoreDb.Collection("routines").Document(routineId);
                var routine = await docRef.GetSnapshotAsync();

                if (routine.Exists)
                {
                    // Update the assignedTo field
                    var updateData = new Dictionary<string, object>
                    {
                        { "AssignedTo", assignedTo }
                    };

                    await docRef.UpdateAsync(updateData);
                }
                else
                {
                    throw new Exception("Routine not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating assigned user for routine {routineId}: {ex.Message}");
                throw new Exception("Failed to assign user. Please try again later.");
            }
        }

    }
}
