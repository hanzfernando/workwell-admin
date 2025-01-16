using Microsoft.AspNetCore.Mvc;

namespace WorkWell.Server.Controllers
{
    public class SuperAdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
