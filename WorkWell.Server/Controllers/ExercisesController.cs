using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {
        private readonly ExerciseService _exerciseService;

        // Constructor with dependency injection
        public ExerciseController(ExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        // GET: api/exercise/{id}
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

        // GET: api/exercise
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exercise>>> GetAllExercises()
        {
            var exercises = await _exerciseService.GetAllExercisesAsync();
            return Ok(exercises);
        }

        // POST: api/exercise
        [HttpPost]
        public async Task<ActionResult> AddExercise([FromBody] Exercise exercise)
        {
            if (exercise == null)
            {
                return BadRequest();
            }

            await _exerciseService.AddExerciseAsync(exercise);
            return CreatedAtAction(nameof(GetExercise), new { exerciseId = exercise.ExerciseId }, exercise);
        }

        // PUT: api/exercise/{id}
        [HttpPut("{exerciseId}")]
        public async Task<ActionResult> UpdateExercise(string exerciseId, [FromBody] Exercise exercise)
        {
            if (exerciseId != exercise.ExerciseId)
            {
                return BadRequest();
            }

            var existingExercise = await _exerciseService.GetExerciseAsync(exerciseId);
            if (existingExercise == null)
            {
                return NotFound();
            }

            await _exerciseService.UpdateExerciseAsync(exercise);
            return NoContent();
        }

        // DELETE: api/exercise/{id}
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
