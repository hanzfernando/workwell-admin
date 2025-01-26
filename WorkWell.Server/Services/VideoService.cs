using Google.Cloud.Firestore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class VideoService
    {
        private readonly FirestoreDb _firestoreDb;

        public VideoService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // GET /api/videos filtered by OrganizationId
        public async Task<IEnumerable<Video>> GetAllVideosByOrganizationAsync(string organizationId)
        {
            try
            {
                // Query Firestore collection for videos belonging to the specified organization
                var query = _firestoreDb
                    .Collection("videos")
                    .WhereEqualTo("OrganizationId", organizationId);

                var snapshot = await query.GetSnapshotAsync();

                return snapshot.Documents.Select(doc =>
                {
                    var video = doc.ConvertTo<Video>();
                    video.VideoId = doc.Id; // Set the document ID
                    return video;
                });
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"Error fetching videos for organization {organizationId}: {ex.Message}");
                throw new System.Exception("Failed to fetch videos. Please try again later.");
            }
        }
    }
}
