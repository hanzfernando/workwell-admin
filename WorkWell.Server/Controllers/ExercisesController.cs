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

        // GET: api/exercises/{id}
        [HttpGet("{exerciseId}")]
        public async Task<ActionResult<Exercise>> GetExercise(string exerciseId)
        {
            var exercise = await _exerciseService.GetExerciseAsync(exerciseId);
            if (exercise == null)
            {
                return NotFound();
            }
            return Ok(exercise);
        }

        // GET: api/exercises
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exercise>>> GetAllExercises()
        {
            var exercises = await _exerciseService.GetAllExercisesAsync();
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

            // Check for invalid enum parsing
            if (!Enum.IsDefined(typeof(TargetArea), exercise.TargetArea))
            {
                return BadRequest($"Invalid exercise type: {exercise.TargetArea}");
            }

            await _exerciseService.AddExerciseAsync(exercise);
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

            var existingExercise = await _exerciseService.GetExerciseAsync(exerciseId);
            if (existingExercise == null)
            {
                return NotFound();
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
            var exercise = await _exerciseService.GetExerciseAsync(exerciseId);
            if (exercise == null)
            {
                return NotFound();
            }

            await _exerciseService.DeleteExerciseAsync(exerciseId);
            return NoContent();
        }
    }
}
