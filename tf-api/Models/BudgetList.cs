namespace tf_api.Models
{
    public class BudgetList
    {
        public int Id { get; set; }
        public List<BudgetItem> Items { get; set; }
        public int DashboardId { get; set; }
        public string Name { get; set; }
    }
}
