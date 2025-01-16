using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WorkWell.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("claims")]
        public IActionResult GetClaims()
        {
            var claims = HttpContext.User.Claims.Select(c => new { c.Type, c.Value });
            return Ok(claims);
        }


        [HttpGet("role-check")]
        public IActionResult RoleCheck()
        {
            var user = HttpContext.User;

            // Check if the Role claim exists
            var roleClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            if (roleClaim == null)
            {
                // Return 401 Unauthorized if the Role claim is missing
                return Unauthorized(new { message = "Role claim is missing." });
            }

            // Verify the role value (adjust based on your application's roles)
            if (roleClaim.Value != "0") // Assuming "0" is the required role for Admin
            {
                // Return 403 Forbidden if the user does not have the required role
                return Forbid("You do not have the required role.");
            }

            // Return success if the role is valid
            return Ok(new { message = "You have the required role." });
        }


    }
}
