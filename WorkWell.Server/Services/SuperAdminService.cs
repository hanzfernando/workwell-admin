using FirebaseAdmin.Auth;
using Google.Cloud.Firestore;
using WorkWell.Server.Models;
using FirebaseAdmin;
using WorkWell.Server.Controllers;

namespace WorkWell.Server.Services
{
    public class SuperAdminService
    {
        private readonly FirestoreDb _firestoreDb;

        public SuperAdminService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        public async Task<AdminAccountRequest> CreateAdminAccount(
    string email,
    string password,
    string firstName,
    string lastName,
    string organizationId)
        {
            try
            {
                // Initialize Firebase Admin SDK if not already done
                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions
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
                var adminDetails = new AdminAccountRequest
                {
                    Uid = userRecord.Uid, // Include the UID
                    Email = email,
                    Password = password,
                    FirstName = firstName,
                    LastName = lastName,
                    OrganizationId = organizationId
                };

                DocumentReference userDoc = _firestoreDb
                    .Collection("users")
                    .Document(userRecord.Uid);

                await userDoc.SetAsync(new
                {
                    Uid = userRecord.Uid,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    OrganizationId = organizationId,
                    Role = UserRole.Admin.ToString("G") // Admin role
                });
                Console.WriteLine("Admin details added to Firestore.");

                // Step 3: Set custom claim (Role = "Admin") in Firebase Authentication
                var customClaims = new Dictionary<string, object>
                {
                    { "Role", UserRole.Admin.ToString("G") },
                    { "OrganizationId", organizationId }
                };

                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userRecord.Uid, customClaims);
                Console.WriteLine($"Custom claims 'Role: {UserRole.Admin}' and 'OrganizationId: {organizationId}' assigned to user.");

                // Return the created admin object with UID
                return adminDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating Admin account: {ex.Message}");
                throw new Exception("Failed to create admin account.", ex);
            }
        }


        public async Task<List<Admin>> GetAllAdminsAsync()
        {
            try
            {
                var snapshot = await _firestoreDb.Collection("users")
                    .WhereEqualTo("Role", UserRole.Admin.ToString("G")) // Use "Admin" string
                    .GetSnapshotAsync();

                return snapshot.Documents.Select(doc => doc.ConvertTo<Admin>()).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching admins: {ex.Message}");
                throw new Exception("Failed to fetch admins.", ex);
            }
        }
    }
}
