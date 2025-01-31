using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    private string GetOrganizationIdFromToken()
    {
        var organizationIdClaim = User.Claims.FirstOrDefault(c => c.Type == "OrganizationId");
        if (organizationIdClaim == null)
        {
            throw new UnauthorizedAccessException("OrganizationId is missing in the token.");
        }
        return organizationIdClaim.Value;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        try
        {
            var organizationId = GetOrganizationIdFromToken();
            var users = await _userService.GetAllUsersAsync(organizationId);
            return Ok(users);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // GET: api/users
    [HttpGet("organization")]
    public async Task<ActionResult<IEnumerable<User>>> GetPatients()
    {
        try
        {
            var organizationId = GetOrganizationIdFromToken();
            var userRoleClaim = User.Claims.FirstOrDefault(c => c.Type == "Role");
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "user_id");

            if (userRoleClaim == null || userIdClaim == null || string.IsNullOrEmpty(userRoleClaim.Value) || string.IsNullOrEmpty(userIdClaim.Value))
            {
                return Unauthorized("Invalid token. Role or User ID missing.");
            }

            string userRole = userRoleClaim.Value;
            string userId = userIdClaim.Value;
            
            IEnumerable<User> users;

            if (userRole == UserRole.Admin.ToString("G"))
            {
                // Fetch only patients assigned to the logged-in Admin
                users = await _userService.GetPatientsByAssignedProfessionalAsync(organizationId, userId);
            }
            else if (userRole == UserRole.AdminAssistant.ToString("G"))
            {
                // Fetch all patients in the organization
                users = await _userService.GetAllPatientsAsync(organizationId);
            }
            else
            {
                return Forbid("Unauthorized access to patient data.");
            }

            return Ok(users);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // GET: api/users/{uid}
    [HttpGet("{uid}")]
    public async Task<ActionResult<User>> GetUser(string uid)
    {
        try
        {
            var organizationId = GetOrganizationIdFromToken();
            var user = await _userService.GetUserAsync(uid, organizationId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("organization-admins")]
    public async Task<ActionResult<IEnumerable<User>>> GetAllOrganizationAdmins()
    {
        try
        {
            var organizationId = GetOrganizationIdFromToken();
            var admins = await _userService.GetAllOrganizationAdminsAsync(organizationId);
            return Ok(admins);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // PATCH: api/users/{uid}/assign-routines
    [HttpPatch("{uid}/assign-routines")]
    public async Task<ActionResult> AssignRoutinesToUser(string uid, [FromBody] List<string> routineIds)
    {
        if (routineIds == null || routineIds.Count == 0)
        {
            return BadRequest("Routine IDs cannot be null or empty.");
        }

        try
        {
            var organizationId = GetOrganizationIdFromToken();
            await _userService.AssignRoutinesToUserAsync(uid, routineIds, organizationId);
            return NoContent(); // Success
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("User or one of the routines not found.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // PATCH: api/users/{uid}/remove-routine
    [HttpPatch("{uid}/remove-routine")]
    public async Task<ActionResult> RemoveRoutineFromUser(string uid, [FromBody] string routineId)
    {
        if (string.IsNullOrEmpty(routineId))
        {
            return BadRequest("Routine ID cannot be null or empty.");
        }

        try
        {
            var organizationId = GetOrganizationIdFromToken();
            await _userService.RemoveRoutineFromUserAsync(uid, routineId, organizationId);
            return NoContent(); // Success
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("User or routine not found.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}
