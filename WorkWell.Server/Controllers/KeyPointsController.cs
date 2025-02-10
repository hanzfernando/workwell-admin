using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Models;
using WorkWell.Server.Services;
using System.Threading.Tasks;
using System.Diagnostics;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class KeyPointsController : ControllerBase
    {
        private readonly KeyPointService _keyPointService;

        public KeyPointsController(KeyPointService keyPointService)
        {
            _keyPointService = keyPointService;
        }

        // POST: api/keypoints
        [HttpPost]
        public async Task<ActionResult<KeyPoints>> AddKeyPoint([FromBody] KeyPoints keypoint)
        {

            Debug.WriteLine("--------------------------------------------");
            Debug.WriteLine(keypoint);
            if (keypoint == null)
            {
                return BadRequest("Invalid keypoint data.");
            }

            var keypointId = await _keyPointService.AddKeyPointAsync(keypoint);
            return CreatedAtAction(nameof(GetKeyPoint), new { keypointId }, keypoint);
        }


        // GET: api/keypoints/{id}
        [HttpGet("{keypointId}")]
        public async Task<ActionResult<KeyPoints>> GetKeyPoint(string keypointId)
        {
            var keypoint = await _keyPointService.GetKeyPointAsync(keypointId);
            if (keypoint == null)
            {
                return NotFound("KeyPoint not found.");
            }
            return Ok(keypoint);
        }

        [HttpPut("{keypointId}")]
        public async Task<ActionResult<KeyPoints>> UpdateKeyPoint(string keypointId, [FromBody] KeyPoints keypoint)
        {
            if (keypoint == null || keypoint.KeypointId != keypointId)
            {
                return BadRequest("Invalid keypoint data.");
            }

            var updatedKeypoint = await _keyPointService.UpdateKeyPointAsync(keypoint);
            if (updatedKeypoint == null)
            {
                return NotFound("KeyPoint not found.");
            }
            return Ok(updatedKeypoint);
        }
    }
}
