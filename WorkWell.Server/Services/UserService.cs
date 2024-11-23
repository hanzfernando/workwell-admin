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
                return users.Where(u => u.Role == UserRole.User).ToList();
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
                return user.Role == UserRole.User ? user : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching user with UID {uid}: {ex.Message}");
                throw new Exception("Failed to fetch user. Please try again later.");
            }
        }

        // PATCH /api/users/{uid}/assign-routines - Assign routines to a user
        public async Task AssignRoutinesToUserAsync(string userId, List<string> routineIds)
        {
            try
            {
                var userRef = _firestoreDb.Collection("users").Document(userId);
                var userSnapshot = await userRef.GetSnapshotAsync();

                if (!userSnapshot.Exists) throw new Exception("User not found.");

                var user = userSnapshot.ConvertTo<User>();

                // Add routine IDs to the user's Routines list, avoiding duplicates
                user.Routines = user.Routines.Union(routineIds).ToList();

                await userRef.SetAsync(user, SetOptions.Overwrite);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error assigning routines to user {userId}: {ex.Message}");
                throw new Exception("Failed to assign routines to user. Please try again later.");
            }
        }

        // PATCH /api/users/{uid}/remove-routine - Remove a routine from a user
        public async Task RemoveRoutineFromUserAsync(string userId, string routineId)
        {
            try
            {
                var userRef = _firestoreDb.Collection("users").Document(userId);
                var userSnapshot = await userRef.GetSnapshotAsync();

                if (!userSnapshot.Exists) throw new Exception("User not found.");

                var user = userSnapshot.ConvertTo<User>();

                // Remove the routine ID from the user's Routines list
                user.Routines = user.Routines.Where(r => r != routineId).ToList();

                await userRef.SetAsync(user, SetOptions.Overwrite);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error removing routine {routineId} from user {userId}: {ex.Message}");
                throw new Exception("Failed to remove routine from user. Please try again later.");
            }
        }

    }
}
