using Google.Cloud.Firestore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class SelfAssessmentService
    {
        private readonly FirestoreDb _firestoreDb;

        public SelfAssessmentService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // GET /api/selfassessments - Filter by OrganizationId
        public async Task<IEnumerable<SelfAssessment>> GetAllSelfAssessmentsByOrganizationAsync(string organizationId)
        {
            try
            {
                var query = _firestoreDb.Collection("selfassessments")
                    .WhereEqualTo("OrganizationId", organizationId); // Filter by OrganizationId
                var snapshot = await query.GetSnapshotAsync();

                return snapshot.Documents.Select(doc =>
                {
                    var selfAssessment = doc.ConvertTo<SelfAssessment>();
                    selfAssessment.SelfAssessmentId = doc.Id; // Set the document ID
                    return selfAssessment;
                });
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"Error fetching self-assessments for organization {organizationId}: {ex.Message}");
                throw new System.Exception("Failed to fetch self-assessments. Please try again later.");
            }
        }
    }
}
