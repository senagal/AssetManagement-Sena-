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
                    FirstName = "Sena",
                    LastName = "A",
                    Age = 25,
                    Department = "Finance",
                    Position = "Manager",
                    Role = "Employee"
                };

                context.Users.AddRange(admin, employee);
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
                    new Asset { Name = "Samsung A50", Category = "phone", SerialNumber = "SN005", PurchaseDate = DateTime.UtcNow, Status = "Available" }
                };
                context.Assets.AddRange(assets);
                context.SaveChanges();
            }
        }
    }
}
