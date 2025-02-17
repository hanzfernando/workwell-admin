using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Cloud.Firestore;
using WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class VisitationLogService
    {
        private readonly FirestoreDb _db;
        private const string CollectionName = "visitationLogs";

        public VisitationLogService(FirestoreDb db)
        {
            _db = db;
        }

        public async Task<List<VisitationLog>> GetVisitationLogsByUserAsync(string uid, string organizationId)
        {
            var query = _db.Collection(CollectionName)
                .WhereEqualTo("Uid", uid)
                .WhereEqualTo("OrganizationId", organizationId);

            var snapshot = await query.GetSnapshotAsync();
            List<VisitationLog> logs = new();

            foreach (var document in snapshot.Documents)
            {
                var log = document.ConvertTo<VisitationLog>();
                log.VisitationLogId = document.Id; // Ensure ID is set
                logs.Add(log);
            }
            return logs;
        }

        public async Task<VisitationLog> AddVisitationLogAsync(VisitationLog log)
        {
            var docRef = _db.Collection(CollectionName).Document();
            log.VisitationLogId = docRef.Id; // Assign Firestore-generated ID
            log.VisitationDate = DateTime.SpecifyKind(log.VisitationDate, DateTimeKind.Utc); // Ensure UTC

            await docRef.SetAsync(log);
            return log;
        }

        public async Task<VisitationLog?> UpdateVisitationLogAsync(string logId, VisitationLog updatedLog)
        {
            var docRef = _db.Collection(CollectionName).Document(logId);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return null; // Log not found
            }

            // Ensure date is in UTC before updating Firestore
            updatedLog.VisitationDate = DateTime.SpecifyKind(updatedLog.VisitationDate, DateTimeKind.Utc);

            await docRef.SetAsync(updatedLog, SetOptions.Overwrite);
            return updatedLog;
        }

    }
}
