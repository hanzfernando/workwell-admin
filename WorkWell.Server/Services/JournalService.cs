using Google.Cloud.Firestore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class JournalService
    {
        private readonly FirestoreDb _firestoreDb;

        public JournalService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // GET /api/journals - Filter by OrganizationId
        public async Task<IEnumerable<Journal>> GetAllJournalsByOrganizationAsync(string organizationId)
        {
            try
            {
                var query = _firestoreDb.Collection("journals")
                    .WhereEqualTo("OrganizationId", organizationId); // Filter by OrganizationId
                var snapshot = await query.GetSnapshotAsync();
                return snapshot.Documents.Select(doc =>
                {
                    var journal = doc.ConvertTo<Journal>();
                    journal.JournalId = doc.Id; // Set the document ID
                    return journal;
                });
            }
            catch (System.Exception ex)
            {
                // Log the exception (consider using a logging framework)
                System.Console.WriteLine($"Error fetching journals for organization {organizationId}: {ex.Message}");
                throw new System.Exception("Failed to fetch journals. Please try again later.");
            }
        }
    }
}
