using Azure;
using Microsoft.EntityFrameworkCore;
using tf_api.DBContexts;
using tf_api.Models;

namespace tf_api.Endpoints
{
    public static class TodoEndpoints
    {
        public static void MapTodoListEndpoints(this WebApplication app)
        {
            // Get all notepads for a specific dashboard
            app.MapGet("/dashboards/{dashboardId}/todolists", async (int dashboardId, TaskFlowDBContext db) =>
            {
                return await db.TodoLists
                    .Where(td => td.DashboardId == dashboardId)
                    .ToListAsync();
            })
                .WithName("Get all Todo lists")
                .WithSummary("Get all Todolists for a specific dashboard")
                .WithDescription("Retrieve a list of all Todo lists for a specific dashboard including their todos")
                .WithTags("Todolist")
                .Produces<List<TodoList>>(StatusCodes.Status200OK);

            app.MapGet("/todolist/{id}", GetListById)
                .WithName("Get specific Todo lists")
                .WithSummary("Gets a specific Todo list")
                .WithDescription("Retrieve a Todo list without checking parent dashboard")
                .WithTags("Todolist")
                .Produces<List<TodoList>>(StatusCodes.Status200OK); ;
        }

        //Hanlders
        private static async Task<IResult> GetListById(int id, TaskFlowDBContext db)
        {
            var result = await db.TodoLists
                         .Include(tl => tl.Todos)
                         .FirstOrDefaultAsync(tl => tl.Id == id) is TodoList todoList
                ? Results.Ok(todoList)
                : Results.NotFound("Couldn't find list");
            return result;
        }

    }
}