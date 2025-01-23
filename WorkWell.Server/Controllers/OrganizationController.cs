using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrganizationController : ControllerBase
    {
        private readonly OrganizationService _organizationService;

        public OrganizationController(OrganizationService organizationService)
        {
            _organizationService = organizationService;
        }

        // GET: api/organization
        [HttpGet]
        public async Task<ActionResult<List<Organization>>> GetAllOrganizations()
        {
            var organizations = await _organizationService.GetAllOrganizationsAsync();
            return Ok(organizations);
        }

        // GET: api/organization/{id}
        [HttpGet("{organizationId}")]
        public async Task<ActionResult<Organization>> GetOrganizationById(string organizationId)
        {
            var organization = await _organizationService.GetOrganizationByIdAsync(organizationId);
            if (organization == null)
                return NotFound();

            return Ok(organization);
        }

        // POST: api/organization
        [HttpPost]
        public async Task<ActionResult> AddOrganization([FromBody] Organization organization)
        {
            await _organizationService.AddOrganizationAsync(organization);
            return CreatedAtAction(nameof(GetOrganizationById), new { organizationId = organization.OrganizationId }, organization);
        }

        // PUT: api/organization/{id}
        [HttpPut("{organizationId}")]
        public async Task<ActionResult> UpdateOrganization(string organizationId, [FromBody] Organization organization)
        {
            try
            {
                await _organizationService.UpdateOrganizationAsync(organizationId, organization);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/organization/{id}
        [HttpDelete("{organizationId}")]
        public async Task<ActionResult> MarkOrganizationInactive(string organizationId)
        {
            try
            {
                await _organizationService.MarkOrganizationInactiveAsync(organizationId);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
