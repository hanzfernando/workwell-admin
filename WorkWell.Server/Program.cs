using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using WorkWell.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WorkWell.Server.Config;

var MyOrigin = "AllowFrontend";
var builder = WebApplication.CreateBuilder(args);


// Access Firebase settings from appsettings.json
var firebaseConfig = builder.Configuration.GetSection("Firebase");
var authAuthority = firebaseConfig["AuthAuthority"];
var audience = firebaseConfig["Audience"];

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

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = authAuthority;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = authAuthority,
            ValidateAudience = true,
            ValidAudience = audience,
            ValidateLifetime = true
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var claimsIdentity = context.Principal.Identity as ClaimsIdentity;

                // Map the "Role" claim to "ClaimTypes.Role"
                var roleClaim = claimsIdentity?.FindFirst("Role");
                if (roleClaim != null)
                {
                    claimsIdentity?.AddClaim(new Claim(ClaimTypes.Role, roleClaim.Value));
                }

                // Map the "organizationId" claim to a custom claim type
                var organizationIdClaim = claimsIdentity?.FindFirst("OrganizationId");
                if (organizationIdClaim != null)
                {
                    claimsIdentity?.AddClaim(new Claim("OrganizationId", organizationIdClaim.Value));
                }

                return Task.CompletedTask;
            }

        };
    });


builder.Services.AddAuthorization();

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
builder.Services.AddScoped<SuperAdminAccountService>();
builder.Services.AddScoped<RoutineLogService>();
builder.Services.AddScoped<VideoService>();
builder.Services.AddScoped<SelfAssessmentService>();
builder.Services.AddScoped<JournalService>();
builder.Services.AddScoped<OrganizationService>();
builder.Services.AddScoped<SuperAdminService>();
builder.Services.AddScoped<ConstraintService>();
builder.Services.AddScoped<KeyPointService>();
builder.Services.AddScoped<MedicalHistoryService>();
builder.Services.AddScoped<DiagnosisService>();
builder.Services.AddScoped<VisitationLogService>();
builder.Services.AddSingleton<CloudinaryConfig>();


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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
