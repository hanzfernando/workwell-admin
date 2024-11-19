using Google.Cloud.Firestore;

namespace WorkWell.Server.Models
{
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

            [FirestoreProperty]
            public UserRole Role { get; set; } = UserRole.User; // Role of the user (Admin, User)

            [FirestoreProperty]
            public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        }
    }

    public class SignUpRequest
    {
        public required string Uid { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public UserRole Role { get; set; } = UserRole.User; // Default to 'User' if not provided
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
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
        public UserRole Role { get; set; } 
        public required string DisplayName { get; set; }
    }

    public class AssignUserRequest
    {
        public required string AssignedTo { get; set; } // User ID to assign to the routine
    }

    public enum UserRole {
        Admin,
        User
    }
}
