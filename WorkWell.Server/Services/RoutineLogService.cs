using Google.Cloud.Firestore;
using WorkWell.Server.Models;
using System.Collections.Generic;
using System.Linq;
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

        // Fetch all routine logs for the requester's organization
        public async Task<List<RoutineLog>> GetRoutineLogsAsync(string organizationId)
        {
            var routineLogs = new List<RoutineLog>();

            // Query routine logs for the given organization
            QuerySnapshot snapshot = await _firestoreDb.Collection("routinelogs")
                .WhereEqualTo("OrganizationId", organizationId)
                .GetSnapshotAsync();

            foreach (var doc in snapshot.Documents)
            {
                var routineLog = doc.ConvertTo<RoutineLog>();
                routineLogs.Add(routineLog);
            }

            return routineLogs;
        }

        // Fetch a single routine log by ID, ensuring it belongs to the organization
        public async Task<RoutineLog?> GetRoutineLogByIdAsync(string routineLogId, string organizationId)
        {
            DocumentSnapshot snapshot = await _firestoreDb.Collection("routinelogs").Document(routineLogId).GetSnapshotAsync();

            if (snapshot.Exists)
            {
                var routineLog = snapshot.ConvertTo<RoutineLog>();

                // Verify the organization ID matches
                if (routineLog.OrganizationId == organizationId)
                {
                    return routineLog;
                }
            }

            return null;
        }

        public async Task<bool> UpdateRoutineLogCommentAsync(string routineLogId, string organizationId, string comment)
        {
            DocumentReference docRef = _firestoreDb.Collection("routinelogs").Document(routineLogId);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return false;
            }

            var routineLog = snapshot.ConvertTo<RoutineLog>();

            // Ensure only logs within the same organization can be updated
            if (routineLog.OrganizationId != organizationId)
            {
                return false;
            }

            await docRef.UpdateAsync("Comment", comment);
            return true;
        }

    }
}
