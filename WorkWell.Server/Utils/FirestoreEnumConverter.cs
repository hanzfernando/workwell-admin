using Google.Cloud.Firestore;
using System;

namespace WorkWell.Server.Utils
{
    public class FirestoreEnumConverter<T> : IFirestoreConverter<T> where T : struct, Enum
    {
        public object ToFirestore(T value)
        {
            // Convert enum to string for Firestore
            return value.ToString();
        }

        public T FromFirestore(object value)
        {
            if (value is string stringValue)
            {
                // Convert Firestore string back to enum
                if (Enum.TryParse<T>(stringValue, out var result))
                {
                    return result;
                }
                throw new ArgumentException($"Invalid enum value: {stringValue}");
            }

            throw new ArgumentException($"Unsupported Firestore value type: {value.GetType()}");
        }
    }
}

