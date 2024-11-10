using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public class LoggerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LoggerMiddleware> _logger;

    public LoggerMiddleware(RequestDelegate next, ILogger<LoggerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log the HTTP request
        _logger.LogInformation($"{context.Request.Method} {context.Request.Scheme}://{context.Request.Host}{context.Request.Path}");

        // Call the next middleware in the pipeline
        await _next(context);
    }
}
