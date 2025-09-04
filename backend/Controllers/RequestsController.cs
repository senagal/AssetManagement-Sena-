using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AssetManagement.Data;
using AssetManagement.Models;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class RequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RequestsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize]
    public IActionResult RequestAsset([FromBody] RequestAssetDto requestDto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var asset = _context.Assets.Find(requestDto.AssetId);
        if (asset == null || asset.Status != "Available")
        {
            return BadRequest("Asset not available");
        }

        var request = new AssetRequest
        {
            UserId = userId,
            AssetId = requestDto.AssetId,
            Status = "Requested",
            RequestedOn = DateTime.UtcNow,
            Reason = requestDto.Reason
        };

        _context.AssetRequests.Add(request);
        _context.SaveChanges();

        return Ok(request);
    }

    [HttpGet("user")]
    [Authorize]
    public IActionResult GetUserRequests()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var requests = _context.AssetRequests
            .Where(r => r.UserId == userId)
            .Select(r => new
            {
                r.Id,
                r.AssetId,
                AssetName = r.Asset.Name,
                r.Status,
                r.RequestedOn,
                r.HandledOn,
                r.Reason,
                AdminName = r.HandledByAdmin != null
                    ? r.HandledByAdmin.FirstName + " " + r.HandledByAdmin.LastName
                    : null
            })
            .ToList();

        return Ok(requests);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAllRequests()
    {
        var requests = _context.AssetRequests
            .Select(r => new
            {
                r.Id,
                r.AssetId,
                AssetName = r.Asset.Name,
                r.UserId,
                UserName = r.User.FirstName + " " + r.User.LastName,
                r.Status,
                r.RequestedOn,
                r.HandledOn,
                r.Reason,
                AdminName = r.HandledByAdmin != null
                    ? r.HandledByAdmin.FirstName + " " + r.HandledByAdmin.LastName
                    : null
            })
            .ToList();

        return Ok(requests);
    }

    [HttpPut("handle/{requestId}")]
    [Authorize(Roles = "Admin")]
    public IActionResult HandleRequest(int requestId, [FromBody] HandleRequestDto dto)
    {
        var request = _context.AssetRequests.Find(requestId);
        if (request == null) return NotFound("Request not found");

        request.Status = dto.Status;
        request.HandledOn = DateTime.UtcNow;
        request.Reason = dto.Reason;
        request.HandledByAdminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        if (dto.Status == "Approved")
        {
            var asset = _context.Assets.Find(request.AssetId);
            if (asset != null)
            {
                asset.Status = "Unavailable";
            }
        }

        _context.SaveChanges();
        return Ok(request);
    }
}
public class RequestAssetDto
{
    public int AssetId { get; set; }
    public string? Reason { get; set; }
}

public class HandleRequestDto
{
    public string Status { get; set; } = string.Empty; 
    public string? Reason { get; set; } 
}
