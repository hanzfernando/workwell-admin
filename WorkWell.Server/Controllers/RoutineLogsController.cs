using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WorkWell.Server.Services;
using WorkWell.Server.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Security.Claims;

namespace WorkWell.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoutineLogsController : ControllerBase
    {
        private readonly RoutineLogService _routineLogService;

        public RoutineLogsController(RoutineLogService routineLogService)
        {
            _routineLogService = routineLogService;
        }

        // GET: api/RoutineLogs
        [HttpGet]
        public async Task<ActionResult<List<RoutineLog>>> GetRoutineLogs()
        {
            // Extract OrganizationId from token claims
            var organizationId = User.FindFirst("OrganizationId")?.Value;

            if (string.IsNullOrEmpty(organizationId))
            {
                return Unauthorized("OrganizationId is missing in the token.");
            }

            var routineLogs = await _routineLogService.GetRoutineLogsAsync(organizationId);

            return Ok(routineLogs);
        }

        // GET: api/RoutineLogs/{routineLogId}
        [HttpGet("{routineLogId}")]
        public async Task<ActionResult<RoutineLog>> GetRoutineLogById(string routineLogId)
        {
            // Extract OrganizationId from token claims
            var organizationId = User.FindFirst("OrganizationId")?.Value;

            if (string.IsNullOrEmpty(organizationId))
            {
                return Unauthorized("OrganizationId is missing in the token.");
            }

            var routineLog = await _routineLogService.GetRoutineLogByIdAsync(routineLogId, organizationId);

            if (routineLog == null)
            {
                return NotFound($"RoutineLog with ID {routineLogId} not found or does not belong to your organization.");
            }

            return Ok(routineLog);
        }
    }
}
