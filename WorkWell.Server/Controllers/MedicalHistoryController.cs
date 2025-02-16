using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace Workwell.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalHistoryController : ControllerBase
    {
        private readonly MedicalHistoryService _historyService;

        public MedicalHistoryController(MedicalHistoryService historyService)
        {
            _historyService = historyService;
        }

        private string GetOrganizationIdFromToken()
        {
            var organizationId = HttpContext.User.FindFirst("OrganizationId")?.Value;
            if (string.IsNullOrEmpty(organizationId))
            {
                throw new UnauthorizedAccessException("Organization ID not found in token.");
            }
            return organizationId;
        }

        [HttpGet("{uid}")]
        public async Task<IActionResult> GetMedicalHistory(string uid)
        {
            string organizationId = GetOrganizationIdFromToken();
            var history = await _historyService.GetMedicalHistoryByUserAsync(uid, organizationId);
            return Ok(history);
        }

        [HttpPost]
        public async Task<IActionResult> AddMedicalHistory([FromBody] MedicalHistory history)
        {
            string organizationId = GetOrganizationIdFromToken();
            history.OrganizationId = organizationId;
            var newHistory = await _historyService.AddMedicalHistoryAsync(history);
            return CreatedAtAction(nameof(GetMedicalHistory), new { uid = history.Uid }, newHistory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalHistory(string id, [FromBody] MedicalHistory updatedHistory)
        {
            string organizationId = GetOrganizationIdFromToken();

            if (updatedHistory.OrganizationId != organizationId)
            {
                return Unauthorized("You are not allowed to update this record.");
            }

            var result = await _historyService.UpdateMedicalHistoryAsync(id, updatedHistory);
            if (result == null)
            {
                return NotFound("Medical history record not found.");
            }

            return Ok(result);
        }
    }
}
