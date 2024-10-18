namespace tf_api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int DashboardId { get; set; }
        public string DashboardName { get; set; }

    }
}
