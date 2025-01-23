using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

[ApiController]
[Route("api/[controller]")]
public class SuperAdminController : ControllerBase
{
    private readonly SuperAdminAccountService _superAdminAccountService;

    public SuperAdminController(SuperAdminAccountService superAdminAccountService)
    {
        _superAdminAccountService = superAdminAccountService;
    }

    [HttpPost("createSuperAdmin")]
    public async Task<IActionResult> CreateSuperAdmin([FromBody] SuperAdminAccountRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest("Email and Password are required.");
        }

        try
        {
            await _superAdminAccountService.CreateSuperAdminAccount(
                request.Email,
                request.Password,
                request.FirstName,
                request.LastName
            );

            return Ok("Super Admin account created successfully.");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating Super Admin account: {ex.Message}");
        }
    }
}

// Request model for creating a Super Admin

