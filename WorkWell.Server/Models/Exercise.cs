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
        public required string OrganizationId { get; set; }

        [FirestoreProperty]  
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
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
