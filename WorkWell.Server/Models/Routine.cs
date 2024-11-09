namespace WorkWell.Server.Models
{
    public class Routine
    {
        public required string RoutineId { get; set; } // Routine ID, e.g., "routine123"
        public required string Name { get; set; }
        public required string TargetArea { get; set; }
        public string? AssignedTo { get; set; } // User ID reference
        public DateTime CreatedAt { get; set; }

        // List of exercises in the routine
        public List<RoutineExercise> Exercises { get; set; } = new List<RoutineExercise>();
    }

    // Sub-model for each exercise in the routine
    public class RoutineExercise
    {
        public required string ExerciseId { get; set; } // Reference to Exercise ID, e.g., "E001"
        public int Reps { get; set; }
        public int Sets { get; set; }
        public int Rest { get; set; } // Rest time in seconds
    }

}
