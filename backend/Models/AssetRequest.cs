namespace AssetManagement.Models
{
    public class AssetRequest
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;

        public string Status { get; set; } = "Requested";

        public DateTime RequestedOn { get; set; } = DateTime.UtcNow;
        public DateTime? HandledOn { get; set; }

        public int? HandledByAdminId { get; set; }
        public User? HandledByAdmin { get; set; }
    }
}
