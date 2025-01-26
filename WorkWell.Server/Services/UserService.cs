using Google.Cloud.Firestore;
using WorkWell.Server.Models;

public class UserService
{
    private readonly FirestoreDb _firestoreDb;

    public UserService(FirestoreDb firestoreDb)
    {
        _firestoreDb = firestoreDb;
    }

    // GET /api/users - Filtered by organizationId
    public async Task<IEnumerable<User>> GetAllUsersAsync(string organizationId)
    {
        try
        {
            var query = _firestoreDb.Collection("users").WhereEqualTo("OrganizationId", organizationId);
            var snapshot = await query.GetSnapshotAsync();
            var users = snapshot.Documents.Select(doc => doc.ConvertTo<User>());

            // Return users with role 'User' and matching organizationId
            return users.Where(u => u.Role == UserRole.User).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching all users: {ex.Message}");
            throw new Exception("Failed to fetch users. Please try again later.");
        }
    }

    // GET /api/users/{uid} - Filtered by organizationId
    public async Task<User?> GetUserAsync(string uid, string organizationId)
    {
        try
        {
            var docRef = _firestoreDb.Collection("users").Document(uid);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists) return null;

            var user = snapshot.ConvertTo<User>();

            // Check if the user's organizationId matches
            return user.OrganizationId == organizationId && user.Role == UserRole.User ? user : null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching user with UID {uid}: {ex.Message}");
            throw new Exception("Failed to fetch user. Please try again later.");
        }
    }

    // PATCH /api/users/{uid}/assign-routines
    public async Task AssignRoutinesToUserAsync(string userId, List<string> routineIds, string organizationId)
    {
        try
        {
            var userRef = _firestoreDb.Collection("users").Document(userId);
            var userSnapshot = await userRef.GetSnapshotAsync();

            if (!userSnapshot.Exists) throw new Exception("User not found.");

            var user = userSnapshot.ConvertTo<User>();

            // Verify organizationId matches
            if (user.OrganizationId != organizationId)
            {
                throw new UnauthorizedAccessException("User does not belong to your organization.");
            }

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

    // PATCH /api/users/{uid}/remove-routine
    public async Task RemoveRoutineFromUserAsync(string userId, string routineId, string organizationId)
    {
        try
        {
            var userRef = _firestoreDb.Collection("users").Document(userId);
            var userSnapshot = await userRef.GetSnapshotAsync();

            if (!userSnapshot.Exists) throw new Exception("User not found.");

            var user = userSnapshot.ConvertTo<User>();

            // Verify organizationId matches
            if (user.OrganizationId != organizationId)
            {
                throw new UnauthorizedAccessException("User does not belong to your organization.");
            }

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
