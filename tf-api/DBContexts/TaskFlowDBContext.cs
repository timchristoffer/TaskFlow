using Microsoft.EntityFrameworkCore;
using tf_api.Models;

namespace tf_api.DBContexts
{
    public class TaskFlowDBContext : DbContext
    {
        public TaskFlowDBContext(DbContextOptions options) : base(options)
        {

        }
        DbSet<Dashboard> Dashboards { get; set; }
        DbSet<TodoList> TodoLists { get; set; }
        DbSet<Todo> Todos { get; set; }
        DbSet<BudgetList> BudgetLists { get; set; }
        DbSet<BudgetItem> BudgetItems { get; set; }



        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=LAPTOP-ONS01784;Initial Catalog=AESkryptering;Trust Server Certificate=True;Integrated Security = True");
        }
    }
}
