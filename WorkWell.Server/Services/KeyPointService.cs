using WorkWell.Server.Models;
using Google.Cloud.Firestore;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Diagnostics;

namespace WorkWell.Server.Services
{
    public class KeyPointService
    {
        private readonly FirestoreDb _firestoreDb;

        public KeyPointService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // POST /api/keypoints
        public async Task<string> AddKeyPointAsync(KeyPoints keypoint)
        {
            try
            {
                Debug.WriteLine("_______________________________________________");
                var docRef = _firestoreDb.Collection("keypoints").Document();
                keypoint.KeypointId = docRef.Id;
                await docRef.SetAsync(keypoint);
                return keypoint.KeypointId;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding keypoint: {ex.Message}");
                throw new Exception("Failed to add keypoint. Please try again later.");
            }
        }

        // GET /api/keypoints/:id
        public async Task<KeyPoints?> GetKeyPointAsync(string keypointId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("keypoints").Document(keypointId);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                {
                    return null;
                }

                return snapshot.ConvertTo<KeyPoints>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching keypoint with ID {keypointId}: {ex.Message}");
                throw new Exception("Failed to fetch keypoint. Please try again later.");
            }
        }

        // DELETE /api/keypoints/:id
        public async Task DeleteKeyPointAsync(string keypointId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("keypoints").Document(keypointId);
                await docRef.DeleteAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting keypoint with ID {keypointId}: {ex.Message}");
                throw new Exception("Failed to delete keypoint. Please try again later.");
            }
        }
    }
}
