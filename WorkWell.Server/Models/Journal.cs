using Google.Cloud.Firestore;

namespace WorkWell.Server.Models
{
    [FirestoreData]
    public class Journal
    {
        [FirestoreProperty]
        public required string JournalId { get; set; }

        [FirestoreProperty]
        public required string OrganizationId { get; set; }

        [FirestoreProperty]
        public required string Content { get; set; }
    }
}
