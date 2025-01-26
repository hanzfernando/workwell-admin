using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
