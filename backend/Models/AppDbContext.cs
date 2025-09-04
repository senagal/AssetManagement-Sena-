using Microsoft.EntityFrameworkCore;
using AssetManagement.Models;

namespace AssetManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<AssetRequest> AssetRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<AssetRequest>()
                .HasOne(ar => ar.User)
                .WithMany(u => u.Requests)
                .HasForeignKey(ar => ar.UserId);

            modelBuilder.Entity<AssetRequest>()
                .HasOne(ar => ar.Asset)
                .WithMany(a => a.Requests)
                .HasForeignKey(ar => ar.AssetId);
        }
    }
}
