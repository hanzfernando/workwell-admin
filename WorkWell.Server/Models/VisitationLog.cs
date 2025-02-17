using System;
using Google.Cloud.Firestore;

namespace WorkWell.Server.Models
{
    [FirestoreData]
    public class VisitationLog
    {
        [FirestoreProperty]
        public string? VisitationLogId { get; set; }  // Firestore-generated ID

        [FirestoreProperty]
        public required string Uid { get; set; }  // Patient ID

        [FirestoreProperty]
        public string? OrganizationId { get; set; }  // Clinic/Company ID

        [FirestoreProperty]
        public required DateTime VisitationDate { get; set; }  // Date & time of visit

        [FirestoreProperty]
        public required string PurposeOfVisit { get; set; }  // Why the patient visited

        [FirestoreProperty]
        public required string TherapistNotes { get; set; }  // Notes about the session
    }
}
