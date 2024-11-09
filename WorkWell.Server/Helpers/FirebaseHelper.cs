using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Builder.Extensions;

namespace WorkWell.Server.Helpers
{
    public class FirebaseHelper
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly String projectID = "workwell-1306b";

        public FirebaseHelper()
        {
            // Initialize Firebase Admin SDK
            var pathToServiceAccountKey = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "path_to_your_service_account_key.json");
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(pathToServiceAccountKey)
            });

            _firestoreDb = FirestoreDb.Create(projectID); // Replace with your project ID
        }

        // Example: Get data from Firestore
        public async Task<DocumentSnapshot> GetDataFromFirestore(string collection, string documentId)
        {
            var docRef = _firestoreDb.Collection(collection).Document(documentId);
            var documentSnapshot = await docRef.GetSnapshotAsync();
            return documentSnapshot;
        }

        // Example: Add data to Firestore
        public async Task AddDataToFirestore(string collection, string documentId, object data)
        {
            var docRef = _firestoreDb.Collection(collection).Document(documentId);
            await docRef.SetAsync(data);
        }

        // Example: Verify Firebase ID Token
        //public async Task<FirebaseToken?> VerifyIdToken(string idToken)
        //{
        //    try
        //    {
        //        FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
        //        return decodedToken;
        //    }
        //    catch (Exception)
        //    {
        //        // Handle invalid token case
        //        return null;
        //    }
        //}
    }
}
