using Google.Cloud.Firestore;
using WorkWell.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WorkWell.Server.Services
{
    public class RoutineLogService
    {
        private readonly FirestoreDb _firestoreDb;

        public RoutineLogService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Fetch all routine logs
        public async Task<List<RoutineLog>> GetRoutineLogsAsync()
        {
            var routineLogs = new List<RoutineLog>();
            QuerySnapshot snapshot = await _firestoreDb.Collection("routinelogs").GetSnapshotAsync();
            foreach (var doc in snapshot.Documents)
            {
                var routineLog = doc.ConvertTo<RoutineLog>();
                routineLogs.Add(routineLog);
            }
            return routineLogs;
        }

        // Fetch a single routine log by ID
        public async Task<RoutineLog?> GetRoutineLogByIdAsync(string routineLogId)
        {
            DocumentSnapshot snapshot = await _firestoreDb.Collection("routinelogs").Document(routineLogId).GetSnapshotAsync();
            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<RoutineLog>();
            }
            return null;
        }
    }
}
