using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkWell.Server.Models;
using WorkWell.Server.Models.WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
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

        // GET: api/users
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/users/{uid}
        [HttpGet("{uid}")]
        public async Task<ActionResult<User>> GetUser(string uid)
        {
            var user = await _userService.GetUserAsync(uid);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
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
                await _userService.AssignRoutinesToUserAsync(uid, routineIds);
                return NoContent(); // Success
            }
            catch (KeyNotFoundException)
            {
                return NotFound("User or one of the routines not found.");
            }
            catch (System.Exception ex)
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
                await _userService.RemoveRoutineFromUserAsync(uid, routineId);
                return NoContent(); // Success
            }
            catch (KeyNotFoundException)
            {
                return NotFound("User or routine not found.");
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
