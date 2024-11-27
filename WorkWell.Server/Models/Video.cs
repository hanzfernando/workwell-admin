using Google.Cloud.Firestore;

namespace WorkWell.Server.Models
{
    [FirestoreData]
    public class Video
    {
        [FirestoreProperty]
        public required string VideoId { get; set; }

        [FirestoreProperty]
        public required string CloudinaryId { get; set; }

        [FirestoreProperty]
        public required string VideoUrl { get; set; }
    }
}
