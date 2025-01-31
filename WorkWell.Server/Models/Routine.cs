using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Text.Json.Serialization;
using WorkWell.Server.Utils;

namespace WorkWell.Server.Models
{
    [FirestoreData] 
    public class Routine
    {
        [FirestoreProperty] 
        public string? RoutineId { get; set; }

        [FirestoreProperty]
        public required string Name { get; set; }

        [FirestoreProperty(ConverterType = typeof(FirestoreEnumConverter<TargetArea>))]
        [JsonConverter(typeof(Utils.JsonStringEnumConverter<TargetArea>))]
        public required TargetArea TargetArea { get; set; }

        [FirestoreProperty]
        public List<string> Users { get; set; } = new List<string>();

        [FirestoreProperty]
        public string? OrganizationId { get; set; }

        [FirestoreProperty]
        public List<RoutineExercise> Exercises { get; set; } = new List<RoutineExercise>();

        [FirestoreProperty]
        [JsonConverter(typeof(FirestoreTimestampJsonConverter))]
        public Timestamp StartDate { get; set; }

        [FirestoreProperty]
        [JsonConverter(typeof(FirestoreTimestampJsonConverter))]
        public Timestamp EndDate{ get; set; }

        [JsonPropertyName("startDateFormatted")] 
        public string StartDateFormatted => StartDate.ToDateTime().ToLocalTime().ToString("yyyy-MM-dd");
        
        [JsonPropertyName("endDateFormatted")] 
        public string EndDateFormatted => EndDate.ToDateTime().ToLocalTime().ToString("yyyy-MM-dd");
        
        [FirestoreProperty]
        public string? CreatedBy { get; set; }

        // Sub-model for each exercise in the routine
        [FirestoreData] 
        public class RoutineExercise
        {
            [FirestoreProperty]
            public required string ExerciseId { get; set; }

            [FirestoreProperty]
            public int Reps { get; set; }

            [FirestoreProperty]
            public int Duration { get; set; }

        }
    }

}
