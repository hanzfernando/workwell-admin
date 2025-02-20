using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using WorkWell.Server.Utils;

namespace WorkWell.Server.Models
{
    [FirestoreData]
    public class Admin
    {
        [FirestoreProperty]
        public string? Uid { get; set; } // Firebase UID

        [FirestoreProperty]
        public string Email { get; set; } = string.Empty;

        [FirestoreProperty(ConverterType = typeof(FirestoreEnumConverter<UserRole>))]
        [JsonConverter(typeof(Utils.JsonStringEnumConverter<UserRole>))]
        public UserRole Role { get; set; }

        [FirestoreProperty]
        public string FirstName { get; set; } = string.Empty;

        [FirestoreProperty]
        public string LastName { get; set; } = string.Empty;

        [FirestoreProperty]
        public required string OrganizationId { get; set; }
    }

    public class AdminAccountRequest
    {
        public string? Uid { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string OrganizationId { get; set; }
        public required string Role { get; set; }
    }

    public class AdminResponseDto
    {
        public required string Uid { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // Store role as string
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string OrganizationId { get; set; } = string.Empty;
    }

    public class AdminUpdateRequest
    {

        public required string Uid { get; set; }
        public required string Email { get; set; }
        public required string OrganizationId { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }


        public string? Password { get; set; } // Optional for password updates
    }

}
