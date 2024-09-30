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
            app.MapGet("/dashboards/{id}/todolists", GetListsByDashboardId)
                .WithName("Get all Todo lists")
                .WithSummary("Get all Todolists for a specific dashboard")
                .WithDescription("Retrieve a list of all Todo lists for a specific dashboard including their todos")
                .WithTags("Todolist")
                .Produces<List<TodoList>>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            app.MapGet("/todolist/{id}", GetListById)
                .WithName("Get specific Todo lists")
                .WithSummary("Gets a specific Todo list")
                .WithDescription("Retrieve a Todo list without checking parent dashboard")
                .WithTags("Todolist")
                .Produces<List<TodoList>>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            app.MapPost("/todolist/{todoListId}/todos", async (int todoListId, Todo todo, TaskFlowDBContext db) =>
            {
                var todolist = await db.TodoLists
                    .Where(td => td.Id == todoListId)
                    .FirstOrDefaultAsync();
                if (todolist is null)
                {
                    return Results.NotFound();
                }

                todo.IsDone = false;
                todo.TodoListId = todoListId;
                db.Todos.Add(todo);
                await db.SaveChangesAsync();
                return Results.Created($"/todolist/{todoListId}/todos/{todo.Id}", todo);
            })
            .WithName("Create todo")
            .WithSummary("Create a new todo for a Todolist")
            .WithDescription("Create a new todo for a specific todoList in a specific dashboard and return the created todo")
            .WithTags("Todolist")
            .Produces<Todo>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status404NotFound);

            app.MapDelete("/todolist/{id}", DeleteListById)
                .WithName("Delet Todolist")
                .WithSummary("Deletes a Todo list")
                .WithDescription("Removes a whole list of Todos")
                .WithTags("Todolist")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);

            app.MapDelete("/todo/{id}", DeleteTodoById)
                .WithName("Delet Todo")
                .WithSummary("Deletes a Todo")
                .WithDescription("Removes a todo specified by id")
                .WithTags("Todolist")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);

            app.MapPut("/todolist/{listId}/todo/{todoId}", async (int listId, int todoId, Todo updatedTodo, TaskFlowDBContext db) =>
            {
                var todo = await db.Todos.FindAsync(todoId);
                if (todo == null)
                {
                    return Results.NotFound();
                }
                todo.IsDone = updatedTodo.IsDone;
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
                .WithTags("Todolist");

        }

        //Hanlders
        private static async Task<IResult> GetListsByDashboardId(int id, TaskFlowDBContext db)
        {
            var result = await db.TodoLists
                    .Where(tl => tl.DashboardId == id)
                    .ToListAsync() is List<TodoList> todoLists
                ? Results.Ok(todoLists)
                : Results.NotFound("Couldn't find list");
            return result;
        }
        private static async Task<IResult> GetListById(int id, TaskFlowDBContext db)
        {
            var result = await db.TodoLists
                    .Where(tl => tl.Id == id)
                    .Include(tl => tl.Todos)
                    .FirstAsync()
                    is TodoList todoLists
                ? Results.Ok(todoLists)
                : Results.NotFound("Couldn't find list");
            return result;
        }
        private static async Task<IResult> DeleteListById(int id, TaskFlowDBContext db)
        {
            var todolist = await db.TodoLists.FindAsync(id);
            if (todolist is null)
            {
                return Results.NotFound();
            }
            db.TodoLists.Remove(todolist);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }
        private static async Task<IResult> DeleteTodoById(int id, TaskFlowDBContext db)
        {
            var todo = await db.Todos.FindAsync(id);
            if (todo is null)
            {
                return Results.NotFound();
            }
            db.Todos.Remove(todo);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }
    }
}