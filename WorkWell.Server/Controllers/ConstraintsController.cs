using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Models;
using WorkWell.Server.Services;
using System.Threading.Tasks;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ConstraintsController : ControllerBase
    {
        private readonly ConstraintService _constraintService;

        public ConstraintsController(ConstraintService constraintService)
        {
            _constraintService = constraintService;
        }

        // POST: api/constraints
        [HttpPost]
        public async Task<ActionResult<Constraints>> AddConstraint([FromBody] Constraints constraint)
        {
            if (constraint == null)
            {
                return BadRequest("Invalid constraint data.");
            }

            // Save the constraint and retrieve its generated ID
            var constraintId = await _constraintService.AddConstraintAsync(constraint);

            // Set the generated constraint ID on the constraint object
            constraint.ConstraintId = constraintId;

            // Return the entire constraint object with a CreatedAtAction response
            return CreatedAtAction(nameof(GetConstraint), new { constraintId = constraintId }, constraint);
        }



        // GET: api/constraints/{id}
        [HttpGet("{constraintId}")]
        public async Task<ActionResult<Constraints>> GetConstraint(string constraintId)
        {
            var constraint = await _constraintService.GetConstraintAsync(constraintId);
            if (constraint == null)
            {
                return NotFound("Constraint not found.");
            }
            return Ok(constraint);
        }

        // PUT: api/constraints/{constraintId}
        [HttpPut("{constraintId}")]
        public async Task<ActionResult<Constraints>> UpdateConstraint(string constraintId, [FromBody] Constraints constraint)
        {
            if (constraint == null || constraint.ConstraintId != constraintId)
            {
                return BadRequest("Invalid constraint data.");
            }

            var updatedConstraint = await _constraintService.UpdateConstraintAsync(constraint);
            if (updatedConstraint == null)
            {
                return NotFound("Constraint not found.");
            }
            return Ok(updatedConstraint);
        }

        // DELETE: api/constraints/{constraintId}
        [HttpDelete("{constraintId}")]
        public async Task<ActionResult> DeleteConstraint(string constraintId)
        {
            await _constraintService.DeleteConstraintAsync(constraintId);
            return NoContent();
        }
    }
}
