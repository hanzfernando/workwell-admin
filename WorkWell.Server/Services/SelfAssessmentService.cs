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

        // GET /api/selfassessments
        public async Task<IEnumerable<SelfAssessment>> GetAllSelfAssessmentsAsync()
        {
            try
            {
                var query = _firestoreDb.Collection("selfassessments");
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
                System.Console.WriteLine($"Error fetching all self-assessments: {ex.Message}");
                throw new System.Exception("Failed to fetch self-assessments. Please try again later.");
            }
        }
    }
}
