using AssetManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.Migrate();

            if (!context.Users.Any())
            {
                var admin = new User
                {
                    Email = "admin@company.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    FirstName = "Admin",
                    LastName = "A",
                    Age = 30,
                    Department = "IT",
                    Position = "Administrator",
                    Role = "Admin"
                };

                var employee = new User
                {
                    Email = "employee@company.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee@123"),
                    FirstName = "Emp",
                    LastName = "Lo",
                    Age = 25,
                    Department = "Finance",
                    Position = "Manager",
                    Role = "Employee"
                };

                var employee2 = new User
                {
                    Email = "sena@company.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sena@123"),
                    FirstName = "Sena",
                    LastName = "A",
                    Age = 25,
                    Department = "IT",
                    Position = "ICT Officer",
                    Role = "Employee"
                };

                context.Users.AddRange(admin, employee, employee2);
                context.SaveChanges();
            }

            if (!context.Assets.Any())
            {
                var assets = new List<Asset>
                {
                    new Asset { Name = "HP 123", Category = "Laptop", SerialNumber = "SN001", PurchaseDate = DateTime.UtcNow, Status = "Available" },
                    new Asset { Name = "Monitor", Category = "Monitor", SerialNumber = "SN002", PurchaseDate = DateTime.UtcNow, Status = "Available" },
                    new Asset { Name = "Samsung S10", Category = "Phone", SerialNumber = "SN003", PurchaseDate = DateTime.UtcNow, Status = "Available" },
                    new Asset { Name = "Asus", Category = "Laptop", SerialNumber = "SN004", PurchaseDate = DateTime.UtcNow, Status = "Available" },
                    new Asset { Name = "Samsung A50", Category = "Phone", SerialNumber = "SN005", PurchaseDate = DateTime.UtcNow, Status = "Assigned" }
                };

                context.Assets.AddRange(assets);
                context.SaveChanges();
            }

            if (!context.AssetRequests.Any())
            {
                var user1 = context.Users.FirstOrDefault(u => u.Email == "employee@company.com") 
                            ?? throw new Exception("User employee@company.com not found");
                var user2 = context.Users.FirstOrDefault(u => u.Email == "sena@company.com") 
                            ?? throw new Exception("User sena@company.com not found");
                var asset1 = context.Assets.FirstOrDefault(a => a.Name == "HP 123") 
                            ?? throw new Exception("Asset HP 123 not found");
                var asset2 = context.Assets.FirstOrDefault(a => a.Name == "Samsung A50") 
                            ?? throw new Exception("Asset Samsung A50 not found");
                var adminUser = context.Users.FirstOrDefault(u => u.Role.ToLower() == "admin") 
                            ?? throw new Exception("Admin user not found");

                var request1 = new AssetRequest
                {
                    UserId = user1.Id,
                    AssetId = asset1.Id,
                    Status = "Requested",
                    RequestedOn = DateTime.UtcNow.AddDays(-2),
                    Reason = "Need for work project"
                };

                var request2 = new AssetRequest
                {
                    UserId = user2.Id,
                    AssetId = asset2.Id,
                    Status = "Approved",
                    RequestedOn = DateTime.UtcNow.AddDays(-1),
                    HandledOn = DateTime.UtcNow,
                    HandledByAdminId = adminUser.Id,
                    Reason = "Required for testing."
                };

                context.AssetRequests.AddRange(request1, request2);
                context.SaveChanges();
            }
        }
    }
}
