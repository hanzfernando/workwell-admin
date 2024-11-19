using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
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

        // GET /api/users - Filtered to return only users with role 'User'
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            Console.WriteLine("Get All Users");
            try
            {
                var query = _firestoreDb.Collection("users");
                var snapshot = await query.GetSnapshotAsync();
                var users = snapshot.Documents.Select(doc => doc.ConvertTo<User>());

                // Filter users based on role 'User'
                var filteredUsers = users.Where(u => u.Role == UserRole.User).ToList();

                return filteredUsers;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching all users: {ex.Message}");
                throw new Exception("Failed to fetch users. Please try again later.");
            }
        }

        // GET /api/users/{uid} - Fetch single user, ensure role is 'User'
        public async Task<User?> GetUserAsync(string uid)
        {
            try
            {
                var docRef = _firestoreDb.Collection("users").Document(uid);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists) return null;

                var user = snapshot.ConvertTo<User>();

                // Check if the user has role 'User'
                if (user.Role == UserRole.User)
                {
                    return user;
                }

                return null;  // Return null if user role is not 'User'
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching user with UID {uid}: {ex.Message}");
                throw new Exception("Failed to fetch user. Please try again later.");
            }
        }
    }
}
