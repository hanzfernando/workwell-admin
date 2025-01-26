using Google.Cloud.Firestore;

namespace WorkWell.Server.Models
{
    [FirestoreData]
    public class SelfAssessment
    {
        [FirestoreProperty]
        public required string SelfAssessmentId { get; set; }
        [FirestoreProperty]
        public required string OrganizationId { get; set; }
        [FirestoreProperty]
        public required int Awareness { get; set; }

        [FirestoreProperty]
        public required int Difficulty { get; set; }

        [FirestoreProperty]
        public required int Pain { get; set; }
        [FirestoreProperty]
        public required int Stiffness { get; set; }
    }
}
