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
                    a.Status,
                    a.ImageUrl 
                })

                .ToList();

            return Ok(assets);
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadAssetImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("No image uploaded");

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine("wwwroot/images", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var imageUrl = $"/images/{fileName}";
            return Ok(new { imageUrl });
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
                    a.Status,
                    a.ImageUrl 
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
                    a.Status,
                    a.ImageUrl 
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

            bool exists = _context.Assets.Any(a => a.SerialNumber == request.SerialNumber);
            if (exists) return Conflict("An asset with this serial number already exists.");

            var asset = new Asset
            {
                Name = request.Name,
                Category = request.Category,
                SerialNumber = request.SerialNumber,
                PurchaseDate = request.PurchaseDate,
                Status = request.Status,
                ImageUrl = request.ImageUrl 
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
                asset.Status,
                asset.ImageUrl 
            };

            return CreatedAtAction(nameof(GetAsset), new { id = asset.Id }, result);
        }

        [HttpGet("search")]
        [Authorize]
        public IActionResult SearchAssets(
            [FromQuery] string? name,
            [FromQuery] string? serialNumber,
            [FromQuery] string? availability,
            [FromQuery] string? category,
            [FromQuery] string? status)
        {
            var query = _context.Assets.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(a => a.Name.ToLower().Contains(name.ToLower()));

            if (!string.IsNullOrWhiteSpace(serialNumber))
                query = query.Where(a => a.SerialNumber.ToLower().Contains(serialNumber.ToLower()));

            if (!string.IsNullOrWhiteSpace(availability))
            {
                var avail = availability.ToLower();
                if (avail == "available")
                    query = query.Where(a => a.Status.ToLower() == "available");
                else if (avail == "Assigned")
                    query = query.Where(a => a.Status.ToLower() != "available");
            }

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(a => a.Category.ToLower().Contains(category.ToLower()));

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(a => a.Status.ToLower() == status.ToLower());

            var results = query
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.Category,
                    a.SerialNumber,
                    a.PurchaseDate,
                    a.Status,
                    a.ImageUrl 
                })
                .ToList();

            return Ok(results);
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

    asset.ImageUrl = request.ImageUrl ?? asset.ImageUrl; 

    _context.SaveChanges();

    var result = new
    {
        asset.Id,
        asset.Name,
        asset.Category,
        asset.SerialNumber,
        asset.PurchaseDate,
        asset.Status,
        asset.ImageUrl
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
        public string? ImageUrl { get; set; }
    }

    public class UpdateAssetRequest
    {
        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? SerialNumber { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? Status { get; set; }
        public string? ImageUrl { get; set; }
    }
}
