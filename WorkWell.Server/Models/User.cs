using Google.Cloud.Firestore;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using WorkWell.Server.Utils;

namespace WorkWell.Server.Models
{

    [FirestoreData]  // Marks the class as a Firestore document
    public class User
    {
        [FirestoreProperty]
        public string? Uid { get; set; } // Firebase UID

        [FirestoreProperty]
        public required string Email { get; set; }

        [FirestoreProperty]
        public required string FirstName { get; set; }

        [FirestoreProperty]
        public required string LastName { get; set; }

        [FirestoreProperty(ConverterType = typeof(FirestoreEnumConverter<UserRole>))]
        [JsonConverter(typeof(Utils.JsonStringEnumConverter<UserRole>))]
        public UserRole Role { get; set; } = UserRole.User; // Role of the user (Admin, User)

        [FirestoreProperty]
        public int? Age { get; set; } // New: Age of the user
        
        [FirestoreProperty]
        public int? Height { get; set; } 
        
        [FirestoreProperty]
        public int? Weight { get; set; } 
        
        [FirestoreProperty]
        public string? Address { get; set; }
        [FirestoreProperty]
        public string? AssignedProfessional { get; set; }

        [FirestoreProperty]
        public string? Contact { get; set; } 
        
        [FirestoreProperty]
        public string? OrganizationId { get; set; } // New: Age of the user

        [FirestoreProperty]
        public string? MedicalCondition { get; set; } // New: Medical condition of the user (optional)

        [FirestoreProperty]
        public List<string> Routines { get; set; } = new List<string>();
    }


    public class SignUpRequest
    {
        public required string Uid { get; set; }

        public required string Email { get; set; }

        public required string Password { get; set; }
        public string? AssignedProfessional { get; set; }

        public int? Age { get; set; } // New: Age of the user

        public int? Height { get; set; }

        public int? Weight { get; set; }

        public string? Address { get; set; }

        public string? Contact { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public string? OrganizationId { get; set; }

        public string? MedicalCondition { get; set; } // New: Medical condition of the user (optional)
    }


    public class LogInRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class VerifyTokenRequest
    {
        public required string IdToken { get; set; }
    }

    // Response object
    public class FirebaseUser
    {
        public required string UserId { get; set; }
        public required string Email { get; set; }
        [JsonConverter(typeof(Utils.JsonStringEnumConverter<UserRole>))]
        public UserRole Role { get; set; }
        public required string DisplayName { get; set; }
        public string? OrganizationId { get; set; }
    }

    public class AssignUserRequest
    {
        public required string AssignedTo { get; set; } // User ID to assign to the routine
    }

    public enum UserRole {
        [EnumMember(Value = "SuperAdmin")]
        SuperAdmin,

        [EnumMember(Value = "Admin")]
        Admin,

        [EnumMember(Value = "AdminAssistant")]
        AdminAssistant,

        [EnumMember(Value = "User")]
        User,
    }
    
}
