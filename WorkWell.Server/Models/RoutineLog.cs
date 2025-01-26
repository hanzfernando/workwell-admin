using Google.Cloud.Firestore;
using System.Text.Json.Serialization;

namespace WorkWell.Server.Models
{
    [FirestoreData]
    public class RoutineLog
    {
        [FirestoreProperty]
        public required string RoutineLogId { get; set; }

        [FirestoreProperty]
        public required string RoutineLogName { get; set; }

        [FirestoreProperty]
        public required string RoutineId { get; set; }

        [FirestoreProperty]
        public required string SelfAssessmentId { get; set; }

        [FirestoreProperty]
        public required string OrganizationId { get; set; }

        [FirestoreProperty]
        public required string JournalId { get; set; }

        [FirestoreProperty]
        public required string VideoId { get; set; }

        [FirestoreProperty]
        public required string Uid { get; set; }

        [FirestoreProperty]
        [JsonIgnore]
        public Timestamp? CreatedAt { get; set; }

        [JsonPropertyName("createdAtDateTime")] // Use this property for JSON serialization
        public string? CreatedAtFormatted => CreatedAt?.ToDateTime().ToLocalTime().ToString("yyyy-MM-dd hh:mm tt");

    }
}
