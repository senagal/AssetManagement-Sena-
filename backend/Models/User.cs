namespace AssetManagement.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;

        public string Role { get; set; } = "Employee";

        public ICollection<AssetRequest>? Requests { get; set; }
        public string FullName => $"{FirstName} {LastName}";
    }
}
