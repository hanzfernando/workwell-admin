using Google.Cloud.Firestore;
using System;
using System.Text.Json.Serialization;

namespace WorkWell.Server.Models
{
    [FirestoreData]  // Indicates that this class is a Firestore document
    public class Exercise
    {
        [FirestoreProperty]  // This will be saved to Firestore
        public string? ExerciseId { get; set; } // Exercise ID, e.g., "E001"

        [FirestoreProperty]
        public required string Name { get; set; }

        [FirestoreProperty]
        public required string Description { get; set; }

        [FirestoreProperty]
        [JsonConverter(typeof(JsonStringEnumConverter))] // Ensure this converts strings to enum
        public required TargetArea TargetArea { get; set; }

        [FirestoreProperty]  // Optional: Store `CreatedDate` if it's part of the document
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum TargetArea
    {
        Neck,       // 0
        Shoulder,   // 1
        LowerBack,  // 2
    }
}
