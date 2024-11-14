using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WorkWell.Server.Models;
using WorkWell.Server.Models.WorkWell.Server.Models;
using WorkWell.Server.Services;

namespace WorkWell.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/users/{uid}
        [HttpGet("{uid}")]
        public async Task<ActionResult<User>> GetUser(string uid)
        {
            var user = await _userService.GetUserAsync(uid);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
    }
}
