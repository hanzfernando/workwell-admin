using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Services;
using WorkWell.Server.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.Data;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/signup
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            Debug.WriteLine($"Email: {request.Email}, FirstName: {request.FirstName}, LastName: {request.LastName}");

            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            try
            {
                // Default role to User if not passed
                request.Role = request.Role == UserRole.Admin ? request.Role : UserRole.User;

                // Call the SignUpAsync method and get the user object
                var user = await _authService.SignUpAsync(request);

                // Return the user information
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error during signup: {ex.Message}");
            }
        }




        // POST: api/Auth/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LogIn([FromBody] LogInRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            try
            {
                var token = await _authService.LogInAsync(request.Email, request.Password);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error during login: {ex.Message}");
            }
        }

        // POST: api/Auth/verifyToken
        [AllowAnonymous]
        [HttpPost("verifyToken")]
        public async Task<IActionResult> VerifyToken([FromBody] VerifyTokenRequest request)
        {
            Console.WriteLine("Received Token: " + request.IdToken);
            if (string.IsNullOrEmpty(request.IdToken))
            {
                return BadRequest("ID Token is required."); // This may be the reason for the 400 error
            }

            try
            {
                var user = await _authService.VerifyTokenAsync(request.IdToken);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error verifying token: {ex.Message}");
            }
        }

    }
}
