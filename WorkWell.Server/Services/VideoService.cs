using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Google.Cloud.Firestore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkWell.Server.Config;
using WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class VideoService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly Cloudinary _cloudinary;


        public VideoService(FirestoreDb firestoreDb, IConfiguration configuration)
        {
            _firestoreDb = firestoreDb;

            // Use the CloudinaryConfig class to get the account
            var cloudinaryConfig = new CloudinaryConfig();
            _cloudinary = new Cloudinary(cloudinaryConfig.GetCloudinaryAccount(configuration));
        }

        public async Task<string?> UploadVideoAsync(IFormFile videoFile, string organizationId)
        {
            try
            {
                // Upload video to Cloudinary
                using var stream = videoFile.OpenReadStream();
                var uploadParams = new VideoUploadParams
                {
                    File = new FileDescription(videoFile.FileName, stream),
                    Folder = "exercise_videos"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                // Create Video record
                var video = new Models.Video
                {
                    VideoId = Guid.NewGuid().ToString(),
                    CloudinaryId = uploadResult.PublicId,
                    VideoUrl = uploadResult.SecureUrl.ToString(),
                    OrganizationId = organizationId
                };

                // Store video in Firestore
                var docRef = _firestoreDb.Collection("videos").Document(video.VideoId);
                await docRef.SetAsync(video);

                return video.VideoId;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading video: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<Models.Video>> GetAllVideosByOrganizationAsync(string organizationId)
        {
            var query = _firestoreDb.Collection("videos").WhereEqualTo("OrganizationId", organizationId);
            var snapshot = await query.GetSnapshotAsync();

            return snapshot.Documents.Select(doc => doc.ConvertTo<Models.Video>()).ToList();
        }
    }
}
