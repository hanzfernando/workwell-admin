using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VideosController : ControllerBase
    {
        private readonly VideoService _videoService;

        public VideosController(VideoService videoService)
        {
            _videoService = videoService;
        }

        // Helper method to extract Organization ID from token claims
        private string GetOrganizationIdFromToken()
        {
            var organizationId = HttpContext.User.FindFirst("OrganizationId")?.Value;
            if (string.IsNullOrEmpty(organizationId))
            {
                throw new UnauthorizedAccessException("Organization ID not found in token.");
            }
            return organizationId;
        }

        // POST: api/videos/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadVideo([FromForm] IFormFile videoFile)
        {
            if (videoFile == null || videoFile.Length == 0)
            {
                return BadRequest("No video file provided.");
            }

            try
            {
                var organizationId = GetOrganizationIdFromToken();
                Debug.WriteLine(videoFile);

                var videoId = await _videoService.UploadVideoAsync(videoFile, organizationId);
                if (string.IsNullOrEmpty(videoId))
                {
                    throw new Exception("Failed to upload video.");
                }
                Debug.WriteLine(videoId);


                return Ok(new { videoId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/videos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Video>>> GetAllVideos()
        {
            try
            {
                var organizationId = GetOrganizationIdFromToken();
                var videos = await _videoService.GetAllVideosByOrganizationAsync(organizationId);
                return Ok(videos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error fetching videos: {ex.Message}" });
            }
        }
    }
}
