using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AssetManagement.Data;
using AssetManagement.Models;
using BCrypt.Net;
using System.Security.Claims;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Register([FromBody] RegisterUserRequest request)
        
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                return BadRequest("Email already exists");

            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                Age = request.Age,
                Department = request.Department,
                Position = request.Position,
                Role = request.Role ?? "Employee"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Age,
                user.Department,
                user.Position,
                user.Role
            });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = _context.Users.Find(userId);
            if (user == null) return NotFound("User not found");

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Age,
                user.Department,
                user.Position,
                user.Role
            });
        }

        [HttpPut("me")]
        [Authorize]
        public IActionResult UpdateProfile([FromBody] UpdateUserRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = _context.Users.Find(userId);
            if (user == null) return NotFound("User not found");

            user.FirstName = request.FirstName ?? user.FirstName;
            user.LastName = request.LastName ?? user.LastName;
            user.Age = request.Age ?? user.Age;
            user.Department = request.Department ?? user.Department;
            user.Position = request.Position ?? user.Position;

            _context.SaveChanges();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Age,
                user.Department,
                user.Position,
                user.Role
            });
        }
        [HttpDelete("me")]
        [Authorize]
        public IActionResult DeleteAccount()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = _context.Users.Find(userId);
            if (user == null) return NotFound("User not found");

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok("Account deleted");
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Age,
                    u.Department,
                    u.Position,
                    u.Role
                }).ToList();

            return Ok(users);
        }
    }

    public class RegisterUserRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string? Role { get; set; }
    }

    public class UpdateUserRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? Age { get; set; }
        public string? Department { get; set; }
        public string? Position { get; set; }
    }
}
