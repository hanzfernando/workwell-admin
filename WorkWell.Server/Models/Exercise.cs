using Google.Cloud.Firestore;
using System;
using System.Text.Json.Serialization;

namespace WorkWell.Server.Models
{
    [FirestoreData]  // Indicates that this class is a Firestore document
    public class Exercise
    {
        [FirestoreProperty] 
        public string? ExerciseId { get; set; } 

        [FirestoreProperty]
        public required string Name { get; set; }

        [FirestoreProperty]
        public required string Description { get; set; }

        [FirestoreProperty]
        [JsonConverter(typeof(JsonStringEnumConverter))] 
        public required TargetArea TargetArea { get; set; }

        [FirestoreProperty]  
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum TargetArea
    {
        Neck,       // 0
        Shoulder,   // 1
        LowerBack,  // 2
        Thigh       // 3
    }
}
