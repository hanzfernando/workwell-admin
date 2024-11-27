using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using WorkWell.Server.Services;

var MyOrigin = "AllowFrontend";
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
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyOrigin, policy =>
    {
        policy.WithOrigins("https://localhost:5174")  // Allow the frontend Ngrok URL and local URL
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();  // Allow credentials (cookies, tokens)
    });
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
builder.Services.AddScoped<RoutineService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AdminAccountService>();
builder.Services.AddScoped<RoutineLogService>();
builder.Services.AddScoped<VideoService>();
builder.Services.AddScoped<SelfAssessmentService>();
builder.Services.AddScoped<JournalService>();

var app = builder.Build();
//app.UseHttpsRedirection();
//app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(MyOrigin);

// Register the custom LoggerMiddleware
app.UseMiddleware<LoggerMiddleware>();




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
