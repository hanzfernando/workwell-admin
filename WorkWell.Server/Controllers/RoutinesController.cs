using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Models;
using WorkWell.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Diagnostics;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RoutinesController : ControllerBase
    {
        private readonly RoutineService _routineService;

        public RoutinesController(RoutineService routineService)
        {
            _routineService = routineService;
        }

        // Get OrganizationId from JWT token
        private string GetOrganizationIdFromToken()
        {
            var organizationIdClaim = User.Claims.FirstOrDefault(c => c.Type == "OrganizationId");
            if (organizationIdClaim == null)
            {
                throw new UnauthorizedAccessException("OrganizationId is missing in the token.");
            }
            return organizationIdClaim.Value;
        }

        // Get Uid (user identifier) from JWT token
        private string GetUserIdFromToken()
        {
            var uidClaim = User.Claims.FirstOrDefault(c => c.Type == "user_id");
            if (uidClaim == null)
            {
                throw new UnauthorizedAccessException("User ID is missing in the token.");
            }
            return uidClaim.Value;
        }

        private string GetRoleFromToken()
        {
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == "Role");
            if (roleClaim == null)
            {
                throw new UnauthorizedAccessException("Role is missing in the token.");
            }
            return roleClaim.Value;
        }

        // GET: api/routines/{routineId}
        [HttpGet("{routineId}")]
        public async Task<ActionResult<Routine>> GetRoutine(string routineId)
        {
            try
            {
                var organizationId = GetOrganizationIdFromToken();
                var uid = GetUserIdFromToken();
                var routine = await _routineService.GetRoutineAsync(routineId, organizationId, uid);

                if (routine == null)
                {
                    return NotFound("Routine not found or not accessible.");
                }
                return Ok(routine);
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

        // GET: api/routines (fetch all routines created by the logged-in user)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Routine>>> GetAllRoutines()
        {
            try
            {
                string role = GetRoleFromToken();
                if (UserRole.Admin.ToString("G").Equals(role))
                {
                    var organizationId = GetOrganizationIdFromToken();
                    var uid = GetUserIdFromToken();
                    var routines = await _routineService.GetAllRoutinesAsync(organizationId, uid);
                    return Ok(routines);

                }
                else
                {
                    var organizationId = GetOrganizationIdFromToken();
                    var uid = GetUserIdFromToken();
                    var routines = await _routineService.GetAllOrganizationRoutinesAsync(organizationId);
                    return Ok(routines);
                }

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

        // POST: api/routines (create a new routine)
        [HttpPost]
        public async Task<ActionResult> AddRoutine([FromBody] Routine routine)
        {
            try
            {
                if (routine == null)
                {
                    return BadRequest("Invalid input data.");
                }

                var organizationId = GetOrganizationIdFromToken();
                var uid = GetUserIdFromToken();
                routine.OrganizationId = organizationId;
                routine.CreatedBy = uid; // Assign the creator

                await _routineService.AddRoutineAsync(routine);
                return CreatedAtAction(nameof(GetRoutine), new { routineId = routine.RoutineId }, routine);
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

        // PUT: api/routines/{routineId} (update an existing routine)
        [HttpPut("{routineId}")]
        public async Task<ActionResult> UpdateRoutine(string routineId, [FromBody] Routine routine)
        {
            try
            {
                if (routineId != routine.RoutineId)
                {
                    return BadRequest("Routine ID mismatch.");
                }

                var organizationId = GetOrganizationIdFromToken();
                var uid = GetUserIdFromToken();
                var existingRoutine = await _routineService.GetRoutineAsync(routineId, organizationId, uid);
                if (existingRoutine == null)
                {
                    return NotFound("Routine not found or not accessible.");
                }

                routine.OrganizationId = organizationId;
                routine.CreatedBy = uid; // Ensure the creator remains unchanged

                await _routineService.UpdateRoutineAsync(routine);
                return NoContent();
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

        // DELETE: api/routines/{routineId} (delete a routine)
        [HttpDelete("{routineId}")]
        public async Task<ActionResult> DeleteRoutine(string routineId)
        {
            try
            {
                var organizationId = GetOrganizationIdFromToken();
                var uid = GetUserIdFromToken();
                var routine = await _routineService.GetRoutineAsync(routineId, organizationId, uid);
                if (routine == null)
                {
                    return NotFound("Routine not found or not accessible.");
                }

                await _routineService.DeleteRoutineAsync(routineId);
                return NoContent();
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

        // PATCH: api/routines/{routineId}/assign-users (assign users to a routine)
        [HttpPatch("{routineId}/assign-users")]
        public async Task<ActionResult> AssignUsersToRoutine(string routineId, [FromBody] List<string> userIds)
        {
            try
            {
                var organizationId = GetOrganizationIdFromToken();
                var uid = GetUserIdFromToken();

                var routine = await _routineService.GetRoutineAsync(routineId, organizationId, uid);
                if (routine == null)
                {
                    return NotFound("Routine not found or not accessible.");
                }

                await _routineService.AssignUsersToRoutineAsync(routineId, userIds, organizationId);
                return NoContent();
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
    }
}
