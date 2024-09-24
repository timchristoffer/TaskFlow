namespace tf_api.Models
{
    public class Dashboard
    {
        public int Id { get; set; }
        public List<BudgetList> BudgetLists { get; set; }
        public List<TodoList> TodoLists { get; set; }
    }
}
