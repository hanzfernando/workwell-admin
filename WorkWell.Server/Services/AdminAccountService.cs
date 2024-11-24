using System;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Cloud.Firestore;

namespace WorkWell.Server.Services
{
    public class AdminAccountService
    {
        private readonly FirestoreDb _firestoreDb;

        public AdminAccountService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        public async Task CreateAdminAccount(string email, string password, string firstName, string lastName, int age)
        {
            try
            {
                // Step 1: Initialize Firebase Admin SDK (if not already initialized)
                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions()
                    {
                        Credential = Google.Apis.Auth.OAuth2.GoogleCredential.FromFile("path-to-serviceAccountKey.json")
                    });
                }

                // Step 2: Create the Firebase user
                UserRecordArgs args = new UserRecordArgs()
                {
                    Email = email,
                    Password = password,
                    DisplayName = $"{firstName} {lastName}",
                    EmailVerified = true // Optional: mark email as verified
                };

                UserRecord userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(args);

                Console.WriteLine($"Firebase user created successfully with UID: {userRecord.Uid}");

                // Step 3: Add user details to Firestore
                var adminDetails = new
                {
                    Uid = userRecord.Uid,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    Role = 0, // Role 0 for Admin
                    Age = age,
                    MedicalCondition = (string?)null // Optional: set default or null value
                };

                DocumentReference userDoc = _firestoreDb.Collection("users").Document(userRecord.Uid);
                await userDoc.SetAsync(adminDetails);

                Console.WriteLine("Admin details added to Firestore.");

                // Step 4: Add custom claim for Role (Admin)
                var customClaims = new Dictionary<string, object>()
                {
                    { "Role", 0 } // Set Role to Admin
                };

                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userRecord.Uid, customClaims);

                Console.WriteLine("Custom claim 'Role: 0' assigned to user.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating admin account: {ex.Message}");
            }
        }
    }
}
