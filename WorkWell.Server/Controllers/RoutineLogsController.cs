using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WorkWell.Server.Services;
using WorkWell.Server.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

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
            var routineLogs = await _routineLogService.GetRoutineLogsAsync();
            return Ok(routineLogs);
        }

        // GET: api/RoutineLogs/{routineLogId}
        [HttpGet("{routineLogId}")]
        public async Task<ActionResult<RoutineLog>> GetRoutineLogById(string routineLogId)
        {
            var routineLog = await _routineLogService.GetRoutineLogByIdAsync(routineLogId);
            if (routineLog == null)
            {
                return NotFound($"RoutineLog with ID {routineLogId} not found.");
            }
            return Ok(routineLog);
        }
    }
}
