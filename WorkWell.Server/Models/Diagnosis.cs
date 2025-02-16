using System;
using Google.Cloud.Firestore;

namespace WorkWell.Server.Models
{
    [FirestoreData]
    public class Diagnosis
    {
        [FirestoreProperty] // Firestore automatically assigns an ID
        public string? DiagnosisId { get; set; }

        [FirestoreProperty]
        public required string Uid { get; set; }  // Patient ID

        [FirestoreProperty]
        public string? OrganizationId { get; set; }  // Clinic/Company ID

        [FirestoreProperty]
        public required string Symptoms { get; set; }

        [FirestoreProperty]
        public required string DiagnosisResult { get; set; }

        [FirestoreProperty]
        public required string SeverityLevel { get; set; }

        [FirestoreProperty]
        public DateTime DiagnosisDate { get; set; }

        // Treatment Plan
        [FirestoreProperty]
        public required string RecommendedErgonomicAdjustments { get; set; }

        [FirestoreProperty]
        public required string PhysicalTherapyRecommendations { get; set; }

        [FirestoreProperty]
        public required string MedicationPrescriptions { get; set; }

        [FirestoreProperty]
        public DateTime TreatmentPlanStartDate { get; set; }
        [FirestoreProperty]
        public DateTime FollowUpPlan { get; set; }

    }
}
