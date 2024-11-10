using FirebaseAdmin.Auth;
using Google.Cloud.Firestore;
using WorkWell.Server.Models;
using System.Threading.Tasks;
using WorkWell.Server.Models.WorkWell.Server.Models;

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
        public async Task<string> SignUpAsync(string email, string password, UserRole role, string firstName, string lastName)
        {
            try
            {
                // Create user with Firebase Authentication
                var userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(new UserRecordArgs
                {
                    Email = email,
                    Password = password,
                });

                // Send email verification
                //await SendEmailVerification(userRecord.Uid);

                // Create a new user document in Firestore, including firstName, lastName, and role
                var userRef = _firestoreDb.Collection("users").Document(userRecord.Uid);
                await userRef.SetAsync(new User
                {
                    Uid = userRecord.Uid,
                    Email = email,
                    FirstName = firstName,    // Save firstName in Firestore
                    LastName = lastName,      // Save lastName in Firestore
                    Role = role,              // Assign the role during user creation
                });

                // Return the Firebase Custom Token
                var customToken = await FirebaseAuth.DefaultInstance.CreateCustomTokenAsync(userRecord.Uid);
                return customToken;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error signing up: {ex.Message}");
            }
        }


        private async Task SendEmailVerification(string uid)
        {
            var userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(uid);

            // Here you would invoke Firebase's REST API to send the email verification link. 
            // Since C# SDK doesn't have this feature, you could use the Firebase REST API.

            var link = await FirebaseAuth.DefaultInstance.GenerateEmailVerificationLinkAsync(userRecord.Email);
            // You can now send this link to the user via email manually or use a custom email service.
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
                //if (!userRecord.EmailVerified)
                //{
                //    throw new Exception("Please verify your email before logging in.");
                //}

                // Return the Firebase Custom Token if email is verified
                var customToken = await FirebaseAuth.DefaultInstance.CreateCustomTokenAsync(userRecord.Uid);
                return customToken;
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
                // Verify the ID token and get the UID
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
                var uid = decodedToken.Uid;

                // Retrieve user data from Firestore in a single step
                var userDoc = await _firestoreDb.Collection("users").Document(uid).GetSnapshotAsync();

                // Ensure that the Firestore user document exists
                if (!userDoc.Exists)
                    throw new Exception("User not found in Firestore.");

                // Combine FirstName and LastName into DisplayName and return the user info
                var user = userDoc.ConvertTo<User>();
                return new FirebaseUser
                {
                    UserId = uid,
                    Email = user.Email,
                    DisplayName = $"{user.FirstName} {user.LastName}" // Set the concatenated FirstName and LastName
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error verifying token: {ex.Message}");
            }
        }


    }
}
