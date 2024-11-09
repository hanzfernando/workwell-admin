namespace WorkWell.Server.Models
{
    public class Exercise
    {
        public required string ExerciseId { get; set; } // Exercise ID, e.g., "E001"
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string TargetArea { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }

}
