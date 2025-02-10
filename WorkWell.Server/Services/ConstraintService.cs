using WorkWell.Server.Models;
using Google.Cloud.Firestore;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace WorkWell.Server.Services
{
    public class ConstraintService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly KeyPointService _keyPointService;

        public ConstraintService(FirestoreDb firestoreDb, KeyPointService keyPointService)
        {
            _firestoreDb = firestoreDb;
            _keyPointService = keyPointService;
        }

        // POST /api/constraints
        public async Task<string> AddConstraintAsync(Constraints constraint)
        {
            try
            {
                var docRef = _firestoreDb.Collection("constraints").Document();
                constraint.ConstraintId = docRef.Id;
                await docRef.SetAsync(constraint);
                return constraint.ConstraintId;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding constraint: {ex.Message}");
                throw new Exception("Failed to add constraint. Please try again later.");
            }
        }

        // GET /api/constraints/:id
        public async Task<Constraints?> GetConstraintAsync(string constraintId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("constraints").Document(constraintId);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                {
                    return null;
                }

                return snapshot.ConvertTo<Constraints>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching constraint with ID {constraintId}: {ex.Message}");
                throw new Exception("Failed to fetch constraint. Please try again later.");
            }
        }

        // Update constraint document (PUT)
        public async Task<Constraints?> UpdateConstraintAsync(Constraints constraint)
        {
            try
            {
                var docRef = _firestoreDb.Collection("constraints").Document(constraint.ConstraintId);
                await docRef.SetAsync(constraint, SetOptions.Overwrite);
                return constraint;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating constraint: {ex.Message}");
                throw new Exception("Failed to update constraint. Please try again later.");
            }
        }

        // DELETE: Delete a constraint document and its associated keypoints
        public async Task DeleteConstraintAsync(string constraintId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("constraints").Document(constraintId);
                var snapshot = await docRef.GetSnapshotAsync();

                if (snapshot.Exists)
                {
                    // Convert snapshot to a Constraints object
                    var constraint = snapshot.ConvertTo<Constraints>();
                    // Delete each keypoint associated with this constraint
                    foreach (var kpId in constraint.Keypoints)
                    {
                        await _keyPointService.DeleteKeyPointAsync(kpId);
                    }
                }

                // Now delete the constraint document itself
                await docRef.DeleteAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting constraint: {ex.Message}");
                throw new Exception("Failed to delete constraint. Please try again later.");
            }
        }
    }
}
