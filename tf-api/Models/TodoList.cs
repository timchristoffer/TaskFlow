namespace tf_api.Models
{
    public class TodoList
    {
        public int Id { get; set; }
        public int DashboardId { get; set; }
        public string Name { get; set; }
        public List<Todo> Todos { get; set; }
    }
}
