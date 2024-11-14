using Google.Cloud.Firestore;
using System;
using System.Threading.Tasks;
using WorkWell.Server.Models;
using WorkWell.Server.Models.WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class UserService
    {
        private readonly FirestoreDb _firestoreDb;

        public UserService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }
        // GET /api/users
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            try
            {
                var query = _firestoreDb.Collection("users");
                var snapshot = await query.GetSnapshotAsync();
                return snapshot.Documents.Select(doc => doc.ConvertTo<User>());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching all users: {ex.Message}");
                throw new Exception("Failed to fetch users. Please try again later.");
            }
        }

        // GET /api/users/{uid}
        public async Task<User?> GetUserAsync(string uid)
        {
            try
            {
                var docRef = _firestoreDb.Collection("users").Document(uid);
                var snapshot = await docRef.GetSnapshotAsync();
                return snapshot.Exists ? snapshot.ConvertTo<User>() : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching user with UID {uid}: {ex.Message}");
                throw new Exception("Failed to fetch user. Please try again later.");
            }
        }
    }


}
