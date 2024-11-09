using WorkWell.Server.Models;
using Google.Cloud.Firestore;
using System.Threading.Tasks;

namespace WorkWell.Server.Services
{
    public class ExerciseService
    {
        private readonly FirestoreDb _firestoreDb;

        public ExerciseService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Add an exercise to Firestore
        public async Task AddExerciseAsync(Exercise exercise)
        {
            var docRef = _firestoreDb.Collection("exercises").Document(exercise.ExerciseId);
            await docRef.SetAsync(exercise);
        }

        // Get exercise by ID
        public async Task<Exercise> GetExerciseAsync(string exerciseId)
        {
            var docRef = _firestoreDb.Collection("exercises").Document(exerciseId);
            var snapshot = await docRef.GetSnapshotAsync();
            return snapshot.Exists ? snapshot.ConvertTo<Exercise>() : null;
        }

        // Get all exercises
        public async Task<IEnumerable<Exercise>> GetAllExercisesAsync()
        {
            var query = _firestoreDb.Collection("exercises");
            var snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<Exercise>());
        }

        // Update exercise
        public async Task UpdateExerciseAsync(Exercise exercise)
        {
            var docRef = _firestoreDb.Collection("exercises").Document(exercise.ExerciseId);
            await docRef.SetAsync(exercise, SetOptions.Overwrite);
        }

        // Delete exercise
        public async Task DeleteExerciseAsync(string exerciseId)
        {
            var docRef = _firestoreDb.Collection("exercises").Document(exerciseId);
            await docRef.DeleteAsync();
        }
    }
}
