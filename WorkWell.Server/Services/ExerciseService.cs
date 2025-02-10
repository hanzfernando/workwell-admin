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
        private readonly ConstraintService _constraintService;
        private readonly KeyPointService _keyPointService;

        public ExerciseService(FirestoreDb firestoreDb, ConstraintService constraintService, KeyPointService keyPointService)
        {
            _firestoreDb = firestoreDb;
            _constraintService = constraintService;
            _keyPointService = keyPointService;
        }

        // POST /api/exercises
        public async Task AddExerciseAsync(Exercise exercise, string organizationId)
        {
            try
            {
                exercise.OrganizationId = organizationId; // Assign the organizationId from the token
                var docRef = _firestoreDb.Collection("exercises").Document();
                exercise.ExerciseId = docRef.Id;
                await docRef.SetAsync(exercise);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding exercise for organization {organizationId}: {ex.Message}");
                throw new Exception("Failed to add exercise. Please try again later.");
            }
        }


        // GET /api/exercises/:id
        public async Task<Exercise?> GetExerciseAsync(string exerciseId, string organizationId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("exercises").Document(exerciseId);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                {
                    return null;
                }

                var exercise = snapshot.ConvertTo<Exercise>();

                // Ensure the exercise belongs to the requester's organization
                if (exercise.OrganizationId != organizationId)
                {
                    throw new UnauthorizedAccessException("You do not have access to this exercise.");
                }

                return exercise;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching exercise with ID {exerciseId}: {ex.Message}");
                throw new Exception("Failed to fetch exercise. Please try again later.");
            }
        }


        // GET /api/exercises
        public async Task<IEnumerable<Exercise>> GetAllExercisesAsync(string organizationId)
        {
            try
            {
                var query = _firestoreDb.Collection("exercises")
                                        .WhereEqualTo("OrganizationId", organizationId); // Filter by organizationId
                var snapshot = await query.GetSnapshotAsync();
                return snapshot.Documents.Select(doc => doc.ConvertTo<Exercise>());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching exercises for organization {organizationId}: {ex.Message}");
                throw new Exception("Failed to fetch exercises. Please try again later.");
            }
        }


        // PUT /api/exercises/:id
        public async Task<Exercise?> UpdateExerciseAsync(Exercise exercise)
        {
            try
            {
                var docRef = _firestoreDb.Collection("exercises").Document(exercise.ExerciseId);
                await docRef.SetAsync(exercise, SetOptions.Overwrite);
                return exercise;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating exercise: {ex.Message}");
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

        public async Task<Exercise?> GetExerciseAsync(string exerciseId)
        {
            var docRef = _firestoreDb.Collection("exercises").Document(exerciseId);
            var snapshot = await docRef.GetSnapshotAsync();
            if (!snapshot.Exists)
                return null;
            return snapshot.ConvertTo<Exercise>();
        }

        public async Task<ExerciseDetail?> GetExerciseDetailAsync(string exerciseId)
        {
            var exercise = await GetExerciseAsync(exerciseId);
            if (exercise == null)
                return null;

            var constraintDetails = new List<ConstraintDetail>();
            foreach (var constraintId in exercise.Constraints)
            {
                var constraint = await _constraintService.GetConstraintAsync(constraintId);
                if (constraint != null)
                {
                    var keypoints = new List<KeyPoints>();
                    foreach (var keypointId in constraint.Keypoints)
                    {
                        var keypoint = await _keyPointService.GetKeyPointAsync(keypointId);
                        if (keypoint != null)
                        {
                            keypoints.Add(keypoint);
                        }
                    }
                    constraintDetails.Add(new ConstraintDetail { Constraint = constraint, KeyPoints = keypoints });
                }
            }

            return new ExerciseDetail
            {
                Exercise = exercise,
                Constraints = constraintDetails
            };
        }
    }
}
