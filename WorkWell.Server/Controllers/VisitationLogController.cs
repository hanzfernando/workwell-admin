using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VisitationLogController : ControllerBase
{
    private readonly VisitationLogService _visitationLogService;

    public VisitationLogController(VisitationLogService visitationLogService)
    {
        _visitationLogService = visitationLogService;
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
    public async Task<IActionResult> GetVisitationLogs(string uid)
    {
        string organizationId = GetOrganizationIdFromToken();
        var logs = await _visitationLogService.GetVisitationLogsByUserAsync(uid, organizationId);
        return Ok(logs);
    }

    [HttpPost]
    public async Task<IActionResult> AddVisitationLog([FromBody] VisitationLog log)
    {
        string organizationId = GetOrganizationIdFromToken();
        log.OrganizationId = organizationId;
        var newLog = await _visitationLogService.AddVisitationLogAsync(log);
        return CreatedAtAction(nameof(GetVisitationLogs), new { uid = log.Uid }, newLog);
    }

    [HttpPut("{logId}")]
    public async Task<IActionResult> UpdateVisitationLog(string logId, [FromBody] VisitationLog updatedLog)
    {
        string organizationId = GetOrganizationIdFromToken();

        if (updatedLog.OrganizationId != organizationId)
        {
            return Unauthorized("You are not allowed to update this record.");
        }

        var result = await _visitationLogService.UpdateVisitationLogAsync(logId, updatedLog);
        if (result == null)
        {
            return NotFound("Visitation log record not found.");
        }

        return Ok(result);
    }

}
