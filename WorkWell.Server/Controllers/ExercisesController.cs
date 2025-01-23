using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExercisesController : ControllerBase
    {
        private readonly ExerciseService _exerciseService;

        // Constructor with dependency injection
        public ExercisesController(ExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        // Helper method to get claims from the token
        private string GetOrganizationIdFromToken()
        {
            var organizationId = HttpContext.User.FindFirst("OrganizationId")?.Value;
            if (string.IsNullOrEmpty(organizationId))
            {
                throw new UnauthorizedAccessException("Organization ID not found in token.");
            }
            return organizationId;
        }

        // GET: api/exercises/{id}
        [HttpGet("{exerciseId}")]
        public async Task<ActionResult<Exercise>> GetExercise(string exerciseId)
        {
            var organizationId = GetOrganizationIdFromToken(); // Get organizationId from token

            var exercise = await _exerciseService.GetExerciseAsync(exerciseId, organizationId);
            if (exercise == null)
            {
                return NotFound("Exercise not found or you do not have access.");
            }
            return Ok(exercise);
        }

        // GET: api/exercises
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exercise>>> GetAllExercises()
        {
            var organizationId = GetOrganizationIdFromToken(); // Get organizationId from token

            var exercises = await _exerciseService.GetAllExercisesAsync(organizationId);
            return Ok(exercises);
        }

        // POST: api/exercises
        [HttpPost]
        public async Task<ActionResult> AddExercise([FromBody] Exercise exercise)
        {
            if (exercise == null)
            {
                return BadRequest("Invalid input data.");
            }

            // Get organizationId from token and assign it to the exercise
            var organizationId = GetOrganizationIdFromToken();
            exercise.OrganizationId = organizationId;

            // Check for invalid enum parsing
            if (!Enum.IsDefined(typeof(TargetArea), exercise.TargetArea))
            {
                return BadRequest($"Invalid exercise type: {exercise.TargetArea}");
            }

            await _exerciseService.AddExerciseAsync(exercise, organizationId);
            return CreatedAtAction(nameof(GetExercise), new { exerciseId = exercise.ExerciseId }, exercise);
        }

        // PUT: api/exercises/{id}
        [HttpPut("{exerciseId}")]
        public async Task<ActionResult> UpdateExercise(string exerciseId, [FromBody] Exercise exercise)
        {
            if (exerciseId != exercise.ExerciseId)
            {
                return BadRequest("Exercise ID mismatch.");
            }

            var organizationId = GetOrganizationIdFromToken(); // Get organizationId from token

            var existingExercise = await _exerciseService.GetExerciseAsync(exerciseId, organizationId);
            if (existingExercise == null)
            {
                return NotFound("Exercise not found or you do not have access.");
            }

            // Check for invalid enum parsing
            if (!Enum.IsDefined(typeof(TargetArea), exercise.TargetArea))
            {
                return BadRequest($"Invalid exercise type: {exercise.TargetArea}");
            }

            await _exerciseService.UpdateExerciseAsync(exercise);
            return NoContent();
        }

        // DELETE: api/exercises/{id}
        [HttpDelete("{exerciseId}")]
        public async Task<ActionResult> DeleteExercise(string exerciseId)
        {
            var organizationId = GetOrganizationIdFromToken(); // Get organizationId from token

            var exercise = await _exerciseService.GetExerciseAsync(exerciseId, organizationId);
            if (exercise == null)
            {
                return NotFound("Exercise not found or you do not have access.");
            }

            await _exerciseService.DeleteExerciseAsync(exerciseId);
            return NoContent();
        }
    }
}
