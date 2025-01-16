using Google.Cloud.Firestore;

namespace WorkWell.Server.Models
{
    public class SuperAdmin
    {
        [FirestoreProperty]
        public required string Uid { get; set; } // Firebase UID

        [FirestoreProperty]
        public required string Email { get; set; }

        [FirestoreProperty]
        public required string FirstName { get; set; }

        [FirestoreProperty]
        public required string LastName { get; set; }

        [FirestoreProperty]
        public UserRole Role { get; set; } = UserRole.SuperAdmin; // Default to SuperAdmin role
    }
}
