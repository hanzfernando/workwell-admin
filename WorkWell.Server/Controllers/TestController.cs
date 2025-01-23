using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorkWell.Server.Models;

namespace WorkWell.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        // Initialize the AllowedRoles list directly
        private static readonly List<UserRole> AllowedRoles = new()
        {
            UserRole.SuperAdmin,
            UserRole.Admin
        };

        [HttpGet("claims")]
        [AllowAnonymous]
        public IActionResult GetClaims()
        {
            var claims = HttpContext.User.Claims.Select(c => new { c.Type, c.Value });
            return Ok(claims);
        }

        [HttpGet("role-check")]
        [AllowAnonymous]
        public IActionResult RoleCheck()
        {
            // Validate the user's role
            var result = ValidateUserRole(HttpContext.User.Claims, AllowedRoles);

            // If validation fails, return the error response
            if (result != null) return result;

            // Return success if the role is valid
            return Ok(new { message = "You have the required role." });
        }

        private IActionResult ValidateUserRole(IEnumerable<Claim> claims, List<UserRole> allowedRoles)
        {
            var roleClaim = claims.FirstOrDefault(c => c.Type == "Role");
            if (roleClaim == null)
            {
                return Unauthorized(new { message = "Role claim is missing." });
            }

            if (!Enum.TryParse<UserRole>(roleClaim.Value, ignoreCase: true, out var userRole))
            {
                return BadRequest("Invalid role claim value.");
            }

            if (!allowedRoles.Contains(userRole))
            {
                return Forbid("You do not have the required role.");
            }

            return null;
        }
    }
}
