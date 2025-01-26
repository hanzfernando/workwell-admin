using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class JournalsController : ControllerBase
    {
        private readonly JournalService _journalService;

        // Constructor with dependency injection
        public JournalsController(JournalService journalService)
        {
            _journalService = journalService;
        }

        // GET: api/journals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Journal>>> GetAllJournals()
        {
            try
            {
                // Extract OrganizationId from token claims
                var organizationId = User.FindFirst("OrganizationId")?.Value;
                if (string.IsNullOrEmpty(organizationId))
                {
                    return Unauthorized("Missing or invalid OrganizationId.");
                }

                var journals = await _journalService.GetAllJournalsByOrganizationAsync(organizationId);
                return Ok(journals);
            }
            catch (System.Exception ex)
            {
                // Log error and return a 500 Internal Server Error response
                System.Console.WriteLine($"Error fetching journals: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching journals. Please try again later.");
            }
        }
    }
}
