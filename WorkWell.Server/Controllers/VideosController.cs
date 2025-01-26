using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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

        // GET: api/videos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Video>>> GetAllVideos()
        {
            try
            {
                // Extract OrganizationId from the user's claims
                var organizationId = User.Claims.FirstOrDefault(c => c.Type == "OrganizationId")?.Value;

                if (string.IsNullOrEmpty(organizationId))
                {
                    return Unauthorized("OrganizationId claim is missing in the token.");
                }

                // Fetch videos for the same organization
                var videos = await _videoService.GetAllVideosByOrganizationAsync(organizationId);
                return Ok(videos);
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"Error fetching videos: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching videos. Please try again later.");
            }
        }
    }
}
