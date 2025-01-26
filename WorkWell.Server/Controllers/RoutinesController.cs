using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Models;
using WorkWell.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        private string GetOrganizationIdFromToken()
        {
            var organizationIdClaim = User.Claims.FirstOrDefault(c => c.Type == "OrganizationId");
            if (organizationIdClaim == null)
            {
                throw new UnauthorizedAccessException("OrganizationId is missing in the token.");
            }
            return organizationIdClaim.Value;
        }

        // GET: api/routines/{id}
        [HttpGet("{routineId}")]
        public async Task<ActionResult<Routine>> GetRoutine(string routineId)
        {
            try
            {
                var organizationId = GetOrganizationIdFromToken();
                var routine = await _routineService.GetRoutineAsync(routineId, organizationId);
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

        // GET: api/routines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Routine>>> GetAllRoutines()
        {
            try
            {
                var organizationId = GetOrganizationIdFromToken();
                var routines = await _routineService.GetAllRoutinesAsync(organizationId);
                return Ok(routines);
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

        // POST: api/routines
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
                routine.OrganizationId = organizationId;

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

        // PUT: api/routines/{id}
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
                var existingRoutine = await _routineService.GetRoutineAsync(routineId, organizationId);
                if (existingRoutine == null)
                {
                    return NotFound("Routine not found or not accessible.");
                }

                routine.OrganizationId = organizationId;

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

        // DELETE: api/routines/{id}
        [HttpDelete("{routineId}")]
        public async Task<ActionResult> DeleteRoutine(string routineId)
        {
            try
            {
                var organizationId = GetOrganizationIdFromToken();
                var routine = await _routineService.GetRoutineAsync(routineId, organizationId);
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

        [HttpPatch("{routineId}/assign-users")]
        public async Task<ActionResult> AssignUsersToRoutine(string routineId, [FromBody] List<string> userIds)
        {
            try
            {
                var organizationId = GetOrganizationIdFromToken();

                await _routineService.AssignUsersToRoutineAsync(routineId, userIds, organizationId);
                return NoContent(); // Success
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
