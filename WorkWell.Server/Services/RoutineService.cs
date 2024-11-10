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
                routine.RoutineId = docRef.Id; // Assign a unique ID for the routine
                Console.WriteLine($"Adding routine with ID: {routine.RoutineId}");
                await docRef.SetAsync(routine);
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
                return snapshot.Exists ? snapshot.ConvertTo<Routine>() : null;
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
                return snapshot.Documents.Select(doc => doc.ConvertTo<Routine>());
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
    }
}
