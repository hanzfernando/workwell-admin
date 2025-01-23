using System;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Cloud.Firestore;
using WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class SuperAdminAccountService
    {
        private readonly FirestoreDb _firestoreDb;

        public SuperAdminAccountService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        public async Task CreateSuperAdminAccount(
         string email,
         string password,
         string firstName,
         string lastName)
        {
            try
            {
                // Initialize Firebase Admin SDK if not already done
                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions()
                    {
                        Credential = Google.Apis.Auth.OAuth2.GoogleCredential
                            .FromFile("config/workwell-f3985-firebase-adminsdk-kxhb6-7c506c0e59.json")
                    });
                }

                // Step 1: Create the Firebase user
                var userRecordArgs = new UserRecordArgs
                {
                    Email = email,
                    Password = password,
                    DisplayName = $"{firstName} {lastName}",
                    EmailVerified = true
                };

                UserRecord userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(userRecordArgs);

                Console.WriteLine($"Firebase user created successfully with UID: {userRecord.Uid}");

                // Step 2: Create Firestore document
                var superAdminDetails = new
                {
                    Uid = userRecord.Uid,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    Role = UserRole.SuperAdmin.ToString("G") // Save "SuperAdmin" as a string
                };

                DocumentReference userDoc = _firestoreDb.Collection("users").Document(userRecord.Uid);
                await userDoc.SetAsync(superAdminDetails);

                Console.WriteLine("Super Admin details added to Firestore.");

                // Step 3: Set custom claim (Role = "superadmin") in Firebase Authentication
                var customClaims = new Dictionary<string, object>
        {
            { "Role", UserRole.SuperAdmin.ToString("G") } // Save the string representation "SuperAdmin"
        };

                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userRecord.Uid, customClaims);

                Console.WriteLine("Custom claim 'Role: SuperAdmin' assigned to user.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating Super Admin account: {ex.Message}");
                throw; // Rethrow so the controller can catch it
            }
        }


    }
}
