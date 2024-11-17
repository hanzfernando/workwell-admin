using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using WorkWell.Server.Models;
using WorkWell.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutinesController : ControllerBase
    {
        private readonly RoutineService _routineService;

        public RoutinesController(RoutineService routineService)
        {
            _routineService = routineService;
        }

        // GET: api/routines/{id}
        [HttpGet("{routineId}")]
        public async Task<ActionResult<Routine>> GetRoutine(string routineId)
        {
            var routine = await _routineService.GetRoutineAsync(routineId);
            if (routine == null)
            {
                return NotFound();
            }
            return Ok(routine);
        }

        // GET: api/routines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Routine>>> GetAllRoutines()
        {
            var routines = await _routineService.GetAllRoutinesAsync();
            return Ok(routines);
        }

        // POST: api/routines
        [HttpPost]
        public async Task<ActionResult> AddRoutine([FromBody] Routine routine)
        {
            if (routine == null)
            {
                return BadRequest("Invalid input data.");
            }

            // Check for invalid enum parsing in the Routine model
            if (!Enum.IsDefined(typeof(TargetArea), routine.TargetArea))
            {
                return BadRequest($"Invalid target area: {routine.TargetArea}");
            }

            await _routineService.AddRoutineAsync(routine);
            return CreatedAtAction(nameof(GetRoutine), new { routineId = routine.RoutineId }, routine);
        }

        // PUT: api/routines/{id}
        [HttpPut("{routineId}")]
        public async Task<ActionResult> UpdateRoutine(string routineId, [FromBody] Routine routine)
        {
            if (routineId != routine.RoutineId)
            {
                return BadRequest("Routine ID mismatch.");
            }

            var existingRoutine = await _routineService.GetRoutineAsync(routineId);
            if (existingRoutine == null)
            {
                return NotFound();
            }

            // Check for invalid enum parsing in the Routine model
            if (!Enum.IsDefined(typeof(TargetArea), routine.TargetArea))
            {
                return BadRequest($"Invalid target area: {routine.TargetArea}");
            }

            await _routineService.UpdateRoutineAsync(routine);
            return NoContent();
        }

        // DELETE: api/routines/{id}
        [HttpDelete("{routineId}")]
        public async Task<ActionResult> DeleteRoutine(string routineId)
        {
            var routine = await _routineService.GetRoutineAsync(routineId);
            if (routine == null)
            {
                return NotFound();
            }

            await _routineService.DeleteRoutineAsync(routineId);
            return NoContent();
        }
        // PATCH: api/routines/{id}/assign
        [HttpPatch("{routineId}/assign")]
        public async Task<ActionResult> AssignUserToRoutine(string routineId, [FromBody] AssignUserRequest request)
        {
            if (string.IsNullOrEmpty(request.AssignedTo))
            {
                return BadRequest("AssignedTo cannot be null or empty.");
            }

            // Retrieve the existing routine
            var routine = await _routineService.GetRoutineAsync(routineId);
            if (routine == null)
            {
                return NotFound();
            }

            // Update the AssignedTo field
            routine.AssignedTo = request.AssignedTo;

            // Update the routine in Firestore
            await _routineService.UpdateRoutineAsync(routine);

            return NoContent(); // Success
        }


    }
}
