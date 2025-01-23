using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Runtime.Serialization;
using System.Reflection;

namespace WorkWell.Server.Utils
{
    

    public class JsonStringEnumConverter<T> : JsonConverter<T> where T : struct, Enum
    {
        public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var enumText = reader.GetString()!;

            // Try matching against [EnumMember(Value="...")]
            foreach (var field in typeof(T).GetFields(BindingFlags.Public | BindingFlags.Static))
            {
                var attr = field.GetCustomAttribute<EnumMemberAttribute>();
                if (attr?.Value == enumText)
                {
                    return (T)field.GetValue(null)!;
                }
            }

            // If no [EnumMember] match, try parsing as normal enum name (case-insensitive).
            if (Enum.TryParse<T>(enumText, ignoreCase: true, out var value))
            {
                return value;
            }

            throw new JsonException($"Unable to convert \"{enumText}\" to enum {typeof(T).Name}");
        }

        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            // Check if current enum value has [EnumMember] defined
            var enumMember = typeof(T)
                .GetField(value.ToString()!)
                ?.GetCustomAttribute<EnumMemberAttribute>();

            if (enumMember != null && enumMember.Value != null)
            {
                writer.WriteStringValue(enumMember.Value);
            }
            else
            {
                // Fallback to the .ToString() name if no attribute
                writer.WriteStringValue(value.ToString());
            }
        }
    }

}
