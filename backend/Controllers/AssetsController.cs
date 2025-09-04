using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AssetManagement.Data;
using AssetManagement.Models;
using System.Linq;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAllAssets()
        {
            var assets = _context.Assets
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.Category,
                    a.SerialNumber,
                    a.PurchaseDate,
                    a.Status
                })
                .ToList();

            return Ok(assets);
        }

        [HttpGet("available")]
        [Authorize]
        public IActionResult GetAvailableAssets()
        {
            var availableAssets = _context.Assets
                .Where(a => a.Status == "Available")
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.Category,
                    a.SerialNumber,
                    a.PurchaseDate,
                    a.Status
                })
                .ToList();

            return Ok(availableAssets);
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetAsset(int id)
        {
            var asset = _context.Assets
                .Where(a => a.Id == id)
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.Category,
                    a.SerialNumber,
                    a.PurchaseDate,
                    a.Status
                })
                .FirstOrDefault();

            if (asset == null) return NotFound("Asset not found");

            return Ok(asset);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateAsset([FromBody] CreateAssetRequest request)
        {
            if (request == null) return BadRequest("Invalid asset data");

            var asset = new Asset
            {
                Name = request.Name,
                Category = request.Category,
                SerialNumber = request.SerialNumber,
                PurchaseDate = request.PurchaseDate,
                Status = request.Status
            };

            _context.Assets.Add(asset);
            _context.SaveChanges();

            var result = new
            {
                asset.Id,
                asset.Name,
                asset.Category,
                asset.SerialNumber,
                asset.PurchaseDate,
                asset.Status
            };

            return CreatedAtAction(nameof(GetAsset), new { id = asset.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateAsset(int id, [FromBody] UpdateAssetRequest request)
        {
            var asset = _context.Assets.Find(id);
            if (asset == null) return NotFound("Asset not found");

            asset.Name = request.Name ?? asset.Name;
            asset.Category = request.Category ?? asset.Category;
            asset.SerialNumber = request.SerialNumber ?? asset.SerialNumber;
            asset.PurchaseDate = request.PurchaseDate ?? asset.PurchaseDate;
            asset.Status = request.Status ?? asset.Status;

            _context.SaveChanges();

            var result = new
            {
                asset.Id,
                asset.Name,
                asset.Category,
                asset.SerialNumber,
                asset.PurchaseDate,
                asset.Status
            };

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteAsset(int id)
        {
            var asset = _context.Assets.Find(id);
            if (asset == null) return NotFound("Asset not found");

            _context.Assets.Remove(asset);
            _context.SaveChanges();

            return Ok(new { message = "Asset deleted successfully", assetId = id });
        }
    }

    public class CreateAssetRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public string Status { get; set; } = "Available";
    }

    public class UpdateAssetRequest
    {
        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? SerialNumber { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? Status { get; set; }
    }
}
