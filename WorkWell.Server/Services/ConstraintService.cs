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

        public ConstraintService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
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

        // DELETE /api/constraints/:id
        public async Task DeleteConstraintAsync(string constraintId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("constraints").Document(constraintId);
                await docRef.DeleteAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting constraint with ID {constraintId}: {ex.Message}");
                throw new Exception("Failed to delete constraint. Please try again later.");
            }
        }
    }
}
