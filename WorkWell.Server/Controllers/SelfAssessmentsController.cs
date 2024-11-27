using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SelfAssessmentsController : ControllerBase
    {
        private readonly SelfAssessmentService _selfAssessmentService;

        // Constructor with dependency injection
        public SelfAssessmentsController(SelfAssessmentService selfAssessmentService)
        {
            _selfAssessmentService = selfAssessmentService;
        }

        // GET: api/selfassessments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SelfAssessment>>> GetAllSelfAssessments()
        {
            try
            {
                var selfAssessments = await _selfAssessmentService.GetAllSelfAssessmentsAsync();
                return Ok(selfAssessments);
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"Error fetching self-assessments: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching self-assessments. Please try again later.");
            }
        }
    }
}
