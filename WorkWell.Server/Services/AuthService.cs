using FirebaseAdmin.Auth;
using Google.Cloud.Firestore;
using WorkWell.Server.Models;
using System.Threading.Tasks;
using System.Diagnostics;

namespace WorkWell.Server.Services
{
    public class AuthService
    {
        private readonly FirestoreDb _firestoreDb;

        public AuthService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Method for signup (Create new user in Firebase Authentication and Firestore)
        public async Task<User> SignUpAsync(SignUpRequest request)
        {
            try
            {
                // Create a new user document in Firestore
                var user = new User
                {
                    Uid = request.Uid,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Role = UserRole.User, // Default to User; Admin can set this if required
                    OrganizationId = request.OrganizationId, // Set from the admin's token
                    MedicalCondition = request.MedicalCondition,
                    Age = request.Age
                };

                // Save user to Firestore
                var userRef = _firestoreDb.Collection("users").Document(request.Uid);
                await userRef.SetAsync(user);

                // Set custom claims for the user in Firebase Authentication
                var claims = new Dictionary<string, object>
                {
                    { "Role", user.Role.ToString() }, // Store as string (Admin/User/etc.)
                    { "OrganizationId", request.OrganizationId }
                };
                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(request.Uid, claims);

                // Return the full user object
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error signing up: {ex.Message}");
            }
        }




        // Method for login (Verify user with Firebase Authentication)
        public async Task<string> LogInAsync(string email, string password)
        {
            try
            {
                var userRecord = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email);
                if (userRecord == null)
                {
                    throw new Exception("User not found.");
                }

                // Check if the user's email is verified
                if (!userRecord.EmailVerified)
                {
                    throw new Exception("Please verify your email before logging in.");
                }

                // Retrieve ID token with custom claims
                var decodedToken = await FirebaseAuth.DefaultInstance.CreateCustomTokenAsync(userRecord.Uid);

                return decodedToken;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error logging in: {ex.Message}");
            }
        }



        // Verify the ID token from client-side to authenticate user
        public async Task<FirebaseUser> VerifyTokenAsync(string idToken)
        {
            try
            {
                // Validate the token
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

                // Log token claims
                Console.WriteLine("Token Claims: " + decodedToken.Claims);

                var uid = decodedToken.Uid;

                // Fetch user details from Firestore
                var userDoc = await _firestoreDb.Collection("users").Document(uid).GetSnapshotAsync();
                if (!userDoc.Exists)
                {
                    throw new Exception("User not found in Firestore.");
                }

                var user = userDoc.ConvertTo<User>();

                // Handle cases where SuperAdmin does not have an organizationId
                var organizationId = user.Role == UserRole.SuperAdmin ? null : user.OrganizationId;

                return new FirebaseUser
                {
                    UserId = uid,
                    Email = user.Email,
                    Role = user.Role,
                    DisplayName = $"{user.FirstName} {user.LastName}",
                    OrganizationId = organizationId // Set null if SuperAdmin
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error verifying token: {ex.Message}");
            }
        }




    }
}
