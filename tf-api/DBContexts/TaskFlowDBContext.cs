using Microsoft.EntityFrameworkCore;
using tf_api.Models;

namespace tf_api.DBContexts
{
    public class TaskFlowDBContext : DbContext
    {
        //public TaskFlowDBContext(DbContextOptions<TaskFlowDBContext> options) : base(options)
        //{
        //}

        public DbSet<Dashboard> Dashboards { get; set; }
        public DbSet<TodoList> TodoLists { get; set; }
        public DbSet<Todo> Todos { get; set; }
        public DbSet<BudgetList> BudgetLists { get; set; }
        public DbSet<BudgetItem> BudgetItems { get; set; }
        public DbSet<Notepad> Notepads { get; set; }
        public DbSet<Note> Notes { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=TaskFlow;Trust Server Certificate=True;Integrated Security=True");
            }
        }
    }
}
