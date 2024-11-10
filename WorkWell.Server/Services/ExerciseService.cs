using WorkWell.Server.Models;
using Google.Cloud.Firestore;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace WorkWell.Server.Services
{
    public class ExerciseService
    {
        private readonly FirestoreDb _firestoreDb;

        public ExerciseService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // POST /api/exercises
        public async Task AddExerciseAsync(Exercise exercise)
        {
            try
            {
                var docRef = _firestoreDb.Collection("exercises").Document();
                exercise.ExerciseId = docRef.Id;
                await docRef.SetAsync(exercise);
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                Console.WriteLine($"Error adding exercise: {ex.Message}");
                throw new Exception("Failed to add exercise. Please try again later.");
            }
        }

        // GET /api/exercises/:id
        public async Task<Exercise?> GetExerciseAsync(string exerciseId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("exercises").Document(exerciseId);
                var snapshot = await docRef.GetSnapshotAsync();
                return snapshot.Exists ? snapshot.ConvertTo<Exercise>() : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching exercise with ID {exerciseId}: {ex.Message}");
                throw new Exception("Failed to fetch exercise. Please try again later.");
            }
        }

        // GET /api/exercises
        public async Task<IEnumerable<Exercise>> GetAllExercisesAsync()
        {
            try
            {
                var query = _firestoreDb.Collection("exercises");
                var snapshot = await query.GetSnapshotAsync();
                return snapshot.Documents.Select(doc => doc.ConvertTo<Exercise>());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching all exercises: {ex.Message}");
                throw new Exception("Failed to fetch exercises. Please try again later.");
            }
        }

        // PUT /api/exercises/:id
        public async Task UpdateExerciseAsync(Exercise exercise)
        {
            try
            {
                var docRef = _firestoreDb.Collection("exercises").Document(exercise.ExerciseId);
                await docRef.SetAsync(exercise, SetOptions.Overwrite);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating exercise with ID {exercise.ExerciseId}: {ex.Message}");
                throw new Exception("Failed to update exercise. Please try again later.");
            }
        }

        // DELETE /api/exercises/:id
        public async Task DeleteExerciseAsync(string exerciseId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("exercises").Document(exerciseId);
                await docRef.DeleteAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting exercise with ID {exerciseId}: {ex.Message}");
                throw new Exception("Failed to delete exercise. Please try again later.");
            }
        }
    }
}
