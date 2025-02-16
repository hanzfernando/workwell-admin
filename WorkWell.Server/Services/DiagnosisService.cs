using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Cloud.Firestore;
using WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class DiagnosisService
    {
        private readonly FirestoreDb _db;
        private const string CollectionName = "diagnoses";

        public DiagnosisService(FirestoreDb db)
        {
            _db = db;
        }

        public async Task<List<Diagnosis>> GetDiagnosesByUserAsync(string uid, string organizationId)
        {
            var query = _db.Collection(CollectionName)
                .WhereEqualTo("Uid", uid)
                .WhereEqualTo("OrganizationId", organizationId);

            var snapshot = await query.GetSnapshotAsync();
            List<Diagnosis> diagnosisList = new();

            foreach (var document in snapshot.Documents)
            {
                var diagnosis = document.ConvertTo<Diagnosis>();
                diagnosis.DiagnosisId = document.Id; // Ensure DiagnosisId is set
                diagnosisList.Add(diagnosis);
            }
            return diagnosisList;
        }

        public async Task<Diagnosis> AddDiagnosisAsync(Diagnosis diagnosis)
        {
            var docRef = _db.Collection(CollectionName).Document();
            diagnosis.DiagnosisId = docRef.Id; // Assign Firestore's generated ID

            // 🔹 Convert all DateTime fields to UTC before storing in Firestore
            diagnosis.DiagnosisDate = DateTime.SpecifyKind(diagnosis.DiagnosisDate, DateTimeKind.Utc);
            diagnosis.TreatmentPlanStartDate = DateTime.SpecifyKind(diagnosis.TreatmentPlanStartDate, DateTimeKind.Utc);
            diagnosis.FollowUpPlan = DateTime.SpecifyKind(diagnosis.FollowUpPlan, DateTimeKind.Utc);

            await docRef.SetAsync(diagnosis);
            return diagnosis;
        }


        public async Task<Diagnosis?> UpdateDiagnosisAsync(string diagnosisId, Diagnosis updatedDiagnosis)
        {
            var docRef = _db.Collection(CollectionName).Document(diagnosisId);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return null; // Diagnosis record not found
            }

            // 🔹 Ensure DateTime fields are in UTC before updating Firestore
            updatedDiagnosis.DiagnosisDate = DateTime.SpecifyKind(updatedDiagnosis.DiagnosisDate, DateTimeKind.Utc);
            updatedDiagnosis.TreatmentPlanStartDate = DateTime.SpecifyKind(updatedDiagnosis.TreatmentPlanStartDate, DateTimeKind.Utc);
            updatedDiagnosis.FollowUpPlan = DateTime.SpecifyKind(updatedDiagnosis.FollowUpPlan, DateTimeKind.Utc);

            await docRef.SetAsync(updatedDiagnosis, SetOptions.Overwrite);
            return updatedDiagnosis;
        }

    }
}
