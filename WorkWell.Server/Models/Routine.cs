using Google.Cloud.Firestore;
using System.Text.Json.Serialization;

namespace WorkWell.Server.Models
{
    [FirestoreData]  // Marks the class as a Firestore document
    public class Routine
    {
        [FirestoreProperty]  // Marks this property to be saved in Firestore
        public string? RoutineId { get; set; } // Routine ID, e.g., "routine123"

        [FirestoreProperty]
        public required string Name { get; set; }

        [FirestoreProperty]
        [JsonConverter(typeof(JsonStringEnumConverter))] // Ensure this converts strings to enum
        public required TargetArea TargetArea { get; set; }

        [FirestoreProperty]
        public string? AssignedTo { get; set; } // User ID reference
        // populate this field with the user ID of the user who the routine is assigned to
        public string? AssignedName { get; set; } // User name reference

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // List of exercises in the routine
        [FirestoreProperty]
        public List<RoutineExercise> Exercises { get; set; } = new List<RoutineExercise>();
    }

    // Sub-model for each exercise in the routine
    [FirestoreData]  // Marks this class as a Firestore document
    public class RoutineExercise
    {
        [FirestoreProperty]
        public required string ExerciseId { get; set; } // Reference to Exercise ID, e.g., "E001"

        // populate this field with the exercise detaail of the exercise in the routine
        public string? ExerciseName { get; set; } // Exercise name reference
        public string? ExerciseDescription { get; set; } // Exercise description reference

        [FirestoreProperty]
        public int Reps { get; set; }

        [FirestoreProperty]
        public int Sets { get; set; }

        [FirestoreProperty]
        public int Rest { get; set; } // Rest time in seconds
    }


}
