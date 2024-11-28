using Google.Cloud.Firestore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace WorkWell.Server.Utils
{
    public class FirestoreTimestampJsonConverter : JsonConverter<Timestamp>
    {
        public override Timestamp Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            // Convert ISO 8601 string to Firestore Timestamp
            var dateTime = DateTime.Parse(reader.GetString()).ToUniversalTime();
            return Timestamp.FromDateTime(dateTime);
        }

        public override void Write(Utf8JsonWriter writer, Timestamp value, JsonSerializerOptions options)
        {
            // Serialize Firestore Timestamp as ISO 8601 string
            writer.WriteStringValue(value.ToDateTime().ToString("o")); // "o" is the ISO 8601 format
        }
    }

}
