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
            app.MapGet("/todolist{Id}", GetListById)
                .WithSummary("Get Todo-List by ID")
                .WithDescription("Get specific Todo-list by ID")
                .WithTags("TodoLists")
                .Produces<TodoList>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);
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
