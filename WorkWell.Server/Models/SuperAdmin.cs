using Google.Cloud.Firestore;
using System.Text.Json.Serialization;
using WorkWell.Server.Utils;

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
        [JsonConverter(typeof(Utils.JsonStringEnumConverter<UserRole>))]
        public UserRole Role { get; set; } = UserRole.SuperAdmin; // Default to SuperAdmin role
    }

    public class SuperAdminAccountRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
    }
}
