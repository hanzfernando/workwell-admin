using Google.Cloud.Firestore;
using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using WorkWell.Server.Utils;

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

        [FirestoreProperty(ConverterType = typeof(FirestoreEnumConverter<TargetArea>))]
        [JsonConverter(typeof(Utils.JsonStringEnumConverter<TargetArea>))]

        public required TargetArea TargetArea { get; set; }

        [FirestoreProperty]
        public string? OrganizationId { get; set; }

        [FirestoreProperty]
        public List<string> Constraints { get; set; } = new();

        [FirestoreProperty]  
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [FirestoreData]
    public class Constraints
    {
        [FirestoreProperty]
        public string? ConstraintId { get; set; }

        [FirestoreProperty]
        public required double AlignedThreshold { get; set; }

        [FirestoreProperty]
        public required double RestingThreshold { get; set; }

        [FirestoreProperty]
        public required string RestingComparator { get; set; }

        [FirestoreProperty]
        public List<string> Keypoints { get; set; } = new();

    }

    [FirestoreData]
    public class KeyPoints
    {
        [FirestoreProperty]
        //[JsonPropertyName("keypointId")]
        public string? KeypointId { get; set; }

        [FirestoreProperty]
        //[JsonPropertyName("primaryKeypoint")]
        public required string Keypoint { get; set; }

        [FirestoreProperty]
        //[JsonPropertyName("secondaryKeypoint")]
        public string? SecondaryKeypoint { get; set; }

        [FirestoreProperty]
        //[JsonPropertyName("isMidpoint")]
        public bool IsMidpoint { get; set; } = false;
    }

    public class ConstraintDetail
    {
        public Constraints? Constraint { get; set; }
        public List<KeyPoints> KeyPoints { get; set; } = new();
    }

    public class ExerciseDetail
    {
        public Exercise? Exercise { get; set; }
        public List<ConstraintDetail> Constraints { get; set; } = new();
    }



    public enum TargetArea
    {
        [EnumMember(Value = "Neck")]
        Neck,

        [EnumMember(Value = "Shoulder")]
        Shoulder,

        [EnumMember(Value = "LowerBack")]
        LowerBack,

        [EnumMember(Value = "Thigh")]
        Thigh
    }
}
