using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AssetManagement.Data;
using AssetManagement.Models;
using BCrypt.Net;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string _jwtKey;
    public AuthController(AppDbContext context, IConfiguration config)
{
    _context = context;
    _jwtKey = config["JWT_SECRET"] ?? throw new Exception("JWT_SECRET not set");
}

[HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        return BadRequest("Email and password are required.");

    var user = _context.Users.SingleOrDefault(u => u.Email == request.Email);

    if (user == null)
        return NotFound("No account found with this email.");

    if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        return Unauthorized("Incorrect password.");

    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(_jwtKey);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role)
        }),
        Expires = DateTime.UtcNow.AddHours(8),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);

    return Ok(new { token = tokenHandler.WriteToken(token) });
}

}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
