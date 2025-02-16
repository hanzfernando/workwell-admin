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
    public class DiagnosisController : ControllerBase
    {
        private readonly DiagnosisService _diagnosisService;

        public DiagnosisController(DiagnosisService diagnosisService)
        {
            _diagnosisService = diagnosisService;
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
        public async Task<IActionResult> GetDiagnoses(string uid)
        {
            string organizationId = GetOrganizationIdFromToken();
            var diagnoses = await _diagnosisService.GetDiagnosesByUserAsync(uid, organizationId);
            return Ok(diagnoses);
        }

        [HttpPost]
        public async Task<IActionResult> AddDiagnosis([FromBody] Diagnosis diagnosis)
        {
            string organizationId = GetOrganizationIdFromToken();
            diagnosis.OrganizationId = organizationId;
            var newDiagnosis = await _diagnosisService.AddDiagnosisAsync(diagnosis);
            return CreatedAtAction(nameof(GetDiagnoses), new { uid = diagnosis.Uid }, newDiagnosis);
        }

        [HttpPut("{diagnosisId}")]
        public async Task<IActionResult> UpdateDiagnosis(string diagnosisId, [FromBody] Diagnosis updatedDiagnosis)
        {
            string organizationId = GetOrganizationIdFromToken();

            if (updatedDiagnosis.OrganizationId != organizationId)
            {
                return Unauthorized("You are not allowed to update this record.");
            }

            var result = await _diagnosisService.UpdateDiagnosisAsync(diagnosisId, updatedDiagnosis);
            if (result == null)
            {
                return NotFound("Diagnosis record not found.");
            }

            return Ok(result);
        }
    }
}