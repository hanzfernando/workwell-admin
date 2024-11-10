using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using WorkWell.Server.Services;

var builder = WebApplication.CreateBuilder(args);


// Access Firebase settings from appsettings.json
var firebaseConfig = builder.Configuration.GetSection("Firebase");

// Get the service account file path from configuration
var serviceAccountPath = firebaseConfig.GetValue<string>("ServiceAccountPath");
var projectId = firebaseConfig.GetValue<string>("ProjectID");
Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountPath);

// Initialize Firebase using the service account key
FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile(serviceAccountPath)
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register Firestore service
builder.Services.AddSingleton(FirestoreDb.Create(projectId));  // Replace "your-project-id" with your Firebase project ID

// Register ExerciseService for Dependency Injection
builder.Services.AddScoped<ExerciseService>();

var app = builder.Build();

// Register the custom LoggerMiddleware
app.UseMiddleware<LoggerMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
