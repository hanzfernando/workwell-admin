using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SuperAdmin")] // Restrict access to SuperAdmin role
    public class SuperAdminController : ControllerBase
    {
        private readonly SuperAdminService _superAdminService;

        public SuperAdminController(SuperAdminService superAdminService)
        {
            _superAdminService = superAdminService;
        }

        [HttpPost("createAdmin")]
        public async Task<IActionResult> CreateAdmin([FromBody] AdminAccountRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) ||
                string.IsNullOrEmpty(request.Password) ||
                string.IsNullOrEmpty(request.OrganizationId) ||
                string.IsNullOrEmpty(request.Role)) // Ensure Role is provided
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Email, Password, OrganizationId, and Role are required."
                });
            }

            // Convert string to Enum
            if (!Enum.TryParse(request.Role, out UserRole parsedRole))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid role provided. Allowed values: SuperAdmin, Admin, AdminAssistant, User."
                });
            }

            try
            {
                var createdAdmin = await _superAdminService.CreateAdminAccount(
                    request.Email,
                    request.Password,
                    request.FirstName,
                    request.LastName,
                    request.OrganizationId,
                    parsedRole // Pass converted UserRole enum
                );

                return Ok(new
                {
                    success = true,
                    message = "Admin account created successfully.",
                    data = createdAdmin
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error creating Admin account: {ex.Message}"
                });
            }
        }

        [HttpPut("updateAdmin/{uid}")]
        public async Task<IActionResult> UpdateAdmin(string uid, [FromBody] AdminUpdateRequest request)
        {
            if (uid != request.Uid)
                return BadRequest(new { success = false, message = "Admin ID mismatch." });

            try
            {
                var updatedAdmin = await _superAdminService.UpdateAdminAsync(request);
                return Ok(new { success = true, data = updatedAdmin });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }




        [HttpGet("admins")]
        public async Task<IActionResult> GetAllAdmins()
        {
            try
            {
                var admins = await _superAdminService.GetAllAdminsAsync();

                // Handle null or empty cases explicitly
                if (admins == null || !admins.Any())
                {
                    return Ok(new
                    {
                        success = true,
                        data = new List<AdminResponseDto>() // Return an empty list if no admins
                    });
                }

                // Convert Admin objects to AdminResponseDto
                var response = admins.Select(admin => new AdminResponseDto
                {
                    Uid = admin?.Uid ?? string.Empty, // Handle potential nulls with null-coalescing operator
                    Email = admin?.Email ?? string.Empty,
                    Role = admin?.Role.ToString() ?? "Unknown", // Convert enum to string, fallback to "Unknown"
                    FirstName = admin?.FirstName ?? string.Empty,
                    LastName = admin?.LastName ?? string.Empty,
                    OrganizationId = admin?.OrganizationId ?? string.Empty
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error fetching admins: {ex.Message}"
                });
            }
        }


    }


}
