using Google.Cloud.Firestore;

namespace WorkWell.Server.Models
{
    [FirestoreData]
    public class Organization
    {
        [FirestoreProperty]
        public string? OrganizationId { get; set; }

        [FirestoreProperty]
        public required string Name { get; set; }

        [FirestoreProperty]
        public required string Address { get; set; }

        [FirestoreProperty]
        public required string PhoneNumber { get; set; }

        [FirestoreProperty]
        public string? Status { get; set; }
    }
}
