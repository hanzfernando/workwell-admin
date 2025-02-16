using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Cloud.Firestore;
using WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class MedicalHistoryService
    {
        private readonly FirestoreDb _db;
        private const string CollectionName = "medicalhistory";

        public MedicalHistoryService(FirestoreDb db)
        {
            _db = db;
        }

        public async Task<List<MedicalHistory>> GetMedicalHistoryByUserAsync(string uid, string organizationId)
        {
            var query = _db.Collection(CollectionName)
                .WhereEqualTo("Uid", uid)
                .WhereEqualTo("OrganizationId", organizationId);

            var snapshot = await query.GetSnapshotAsync();
            List<MedicalHistory> historyList = new();

            foreach (var document in snapshot.Documents)
            {
                historyList.Add(document.ConvertTo<MedicalHistory>());
            }
            return historyList;
        }

        public async Task<MedicalHistory> AddMedicalHistoryAsync(MedicalHistory history)
        {
            var docRef = _db.Collection(CollectionName).Document();
            history.MedicalHistoryId = docRef.Id; // Ensure ID is set
            await docRef.SetAsync(history);
            return history;
        }

        public async Task<MedicalHistory?> UpdateMedicalHistoryAsync(string id, MedicalHistory updatedHistory)
        {
            var docRef = _db.Collection(CollectionName).Document(id);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return null; // Record not found
            }

            await docRef.SetAsync(updatedHistory, SetOptions.Overwrite);
            return updatedHistory;
        }
    }
}
