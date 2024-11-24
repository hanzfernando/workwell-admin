using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Services;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AdminAccountService _adminAccountService;

    public AdminController(AdminAccountService adminAccountService)
    {
        _adminAccountService = adminAccountService;
    }

    [HttpPost("createAdmin")]
    public async Task<IActionResult> CreateAdmin([FromBody] AdminAccountRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest("Email and Password are required.");
        }

        try
        {
            await _adminAccountService.CreateAdminAccount(request.Email, request.Password, request.FirstName, request.LastName, request.Age);
            return Ok("Admin account created successfully.");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating admin account: {ex.Message}");
        }
    }
}

public class AdminAccountRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Age { get; set; }
}
