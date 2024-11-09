using Microsoft.AspNetCore.Mvc;

namespace WorkWell.Server.Controllers
{
    public class RoutinesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
