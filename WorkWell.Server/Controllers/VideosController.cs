using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideosController : ControllerBase
    {
        private readonly VideoService _videoService;

        // Constructor with dependency injection
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
                var videos = await _videoService.GetAllVideosAsync();
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
