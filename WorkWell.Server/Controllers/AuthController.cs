using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Services;
using WorkWell.Server.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.Data;

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

        // POST: api/Auth/signup
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            try
            {
                // Default role to User if not passed
                var role = request.Role == UserRole.Admin ? request.Role : UserRole.User;

                // Ensure the correct number of arguments is passed
                var token = await _authService.SignUpAsync(request.Email, request.Password, role, request.FirstName, request.LastName);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error during signup: {ex.Message}");
            }
        }


        // POST: api/Auth/login
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
        [HttpPost("verifyToken")]
        public async Task<IActionResult> VerifyToken([FromBody] VerifyTokenRequest request)
        {
            if (string.IsNullOrEmpty(request.IdToken))
            {
                return BadRequest("ID Token is required.");
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
