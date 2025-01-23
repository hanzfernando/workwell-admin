using Google.Cloud.Firestore;
using WorkWell.Server.Models;

namespace WorkWell.Server.Services
{
    public class OrganizationService
    {
        private readonly FirestoreDb _firestoreDb;
        private const string CollectionName = "organizations";

        public OrganizationService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Get all organizations
        public async Task<List<Organization>> GetAllOrganizationsAsync()
        {
            var snapshot = await _firestoreDb.Collection(CollectionName).GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<Organization>()).ToList();
        }

        // Get a specific organization by ID
        public async Task<Organization?> GetOrganizationByIdAsync(string organizationId)
        {
            var docRef = _firestoreDb.Collection(CollectionName).Document(organizationId);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists) return null;

            return snapshot.ConvertTo<Organization>();
        }

        // Add a new organization with "Active" status by default
        public async Task AddOrganizationAsync(Organization organization)
        {
            organization.Status = "Active"; // Set status to Active by default
            var docRef = _firestoreDb.Collection(CollectionName).Document();
            organization.OrganizationId = docRef.Id;
            await docRef.SetAsync(organization);
        }

        // Update an organization
        public async Task UpdateOrganizationAsync(string organizationId, Organization organization)
        {
            if (organizationId != organization.OrganizationId)
                throw new ArgumentException("Organization ID mismatch.");

            var docRef = _firestoreDb.Collection(CollectionName).Document(organizationId);
            await docRef.SetAsync(organization, SetOptions.Overwrite);
        }

        // Mark an organization as "Inactive" instead of deleting it
        public async Task MarkOrganizationInactiveAsync(string organizationId)
        {
            var docRef = _firestoreDb.Collection(CollectionName).Document(organizationId);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
                throw new ArgumentException("Organization not found.");

            var organization = snapshot.ConvertTo<Organization>();
            organization.Status = "Inactive"; // Update status to Inactive

            await docRef.SetAsync(organization, SetOptions.Overwrite);
        }
    }
}
