using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WorkWell.Server.Models;

public class UserService
{
    private readonly FirestoreDb _firestoreDb;

    public UserService(FirestoreDb firestoreDb)
    {
        _firestoreDb = firestoreDb;
    }

    public async Task<User?> UpdateUserAsync(string uid, User updatedUser)
    {
        try
        {
            var userRef = _firestoreDb.Collection("users").Document(uid);
            var snapshot = await userRef.GetSnapshotAsync();

            if (!snapshot.Exists) return null;

            updatedUser.Uid = uid; // Ensure UID is not changed

            await userRef.SetAsync(updatedUser, SetOptions.Overwrite);
            return updatedUser;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating user {uid}: {ex.Message}");
            throw new Exception("Failed to update user.");
        }
    }


    // GET /api/users - Filtered by organizationId
    public async Task<IEnumerable<User>> GetAllUsersAsync(string organizationId)
    {
        try
        {
            var query = _firestoreDb.Collection("users")
                .WhereEqualTo("OrganizationId", organizationId)
                .WhereEqualTo("Role", UserRole.User.ToString("G")); // Fetch only 'User' roles

            var snapshot = await query.GetSnapshotAsync();
            var users = snapshot.Documents.Select(doc => doc.ConvertTo<User>()).ToList();

            return users;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching users with Role: User - {ex.Message}");
            throw new Exception("Failed to fetch users. Please try again later.");
        }
    }


    public async Task<IEnumerable<User>> GetAllPatientsAsync(string organizationId)
    {
        try
        {
            var query = _firestoreDb.Collection("users")
                .WhereEqualTo("OrganizationId", organizationId)
                ;

            var snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<User>()).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching patients: {ex.Message}");
            throw new Exception("Failed to fetch patients. Please try again later.");
        }
    }

    // GET /api/users/patients?assignedProfessional={userId} - Get only patients assigned to a specific Admin
    public async Task<IEnumerable<User>> GetPatientsByAssignedProfessionalAsync(string organizationId, string assignedProfessionalId)
    {
        try
        {
            var query = _firestoreDb.Collection("users")
                .WhereEqualTo("OrganizationId", organizationId)
                .WhereEqualTo("AssignedProfessional", assignedProfessionalId)
                ;

            var snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<User>()).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching assigned patients: {ex.Message}");
            throw new Exception("Failed to fetch assigned patients. Please try again later.");
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
   
    // GET /api/users/organization-admins - Get all admins in the requester's organization
    public async Task<IEnumerable<Admin>> GetAllOrganizationAdminsAsync(string organizationId)
    {
        try
        {
            var query = _firestoreDb.Collection("users")
                .WhereEqualTo("OrganizationId", organizationId)
                .WhereEqualTo("Role", UserRole.Admin.ToString("G"));

            var snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<Admin>()).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching admins: {ex.Message}");
            throw new Exception("Failed to fetch admins. Please try again later.");
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
