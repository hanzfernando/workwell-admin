using System;
using Google.Cloud.Firestore;
namespace WorkWell.Server.Models
{
    [FirestoreData]
    public class MedicalHistory
    {
        [FirestoreProperty]
        public string? MedicalHistoryId { get; set; }

        [FirestoreProperty]
        public required string Uid { get; set; }  // Patient's UID

        [FirestoreProperty]
        public string? OrganizationId { get; set; } // Organization ID

        [FirestoreProperty]
        public required string PastInjuries { get; set; }

        [FirestoreProperty]
        public required string ChronicConditions { get; set; }

        [FirestoreProperty]
        public required string PreviousTreatments { get; set; }

        [FirestoreProperty]
        public required string Surgeries { get; set; }

        [FirestoreProperty]
        public required string FamilyMedicalHistory { get; set; }

        [FirestoreProperty]
        public Timestamp CreatedAt { get; set; } = Timestamp.FromDateTime(DateTime.UtcNow);
    }
}
