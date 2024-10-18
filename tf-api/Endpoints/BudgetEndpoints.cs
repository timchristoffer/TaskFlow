using tf_api.DBContexts;
using tf_api.Models;
using Microsoft.EntityFrameworkCore;

namespace tf_api.Endpoints
{
    public static class BudgetEndpoints
    {
        public static void MapBudgetListEndpoints(this WebApplication app)
        {
            app.MapGet("/budgetLists", GetAllBudgetLists)
                .WithName("GetAllBudgetLists")
                .WithSummary("Get all budget lists for a specific dashboard")
                .WithDescription("Retrieve a list of all budget lists for a specific dashboard including their budget items")
                .WithTags("BudgetLists")
                .Produces<List<BudgetList>>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            app.MapGet("/budgetLists/{budgetListId}", GetBudgetListById)
                .WithName("GetBudgetListById")
                .WithSummary("Get budget list by ID")
                .WithDescription("Retrieve a specific budget list by its ID including its items")
                .WithTags("BudgetLists")
                .Produces<BudgetList>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            app.MapPost("/budgetLists", PostBudgetList)
                .WithName("CreateBudgetList")
                .WithSummary("Create a new budget list")
                .WithDescription("Create a new budget list and return the created budget list")
                .WithTags("BudgetLists")
                .Produces<BudgetList>(StatusCodes.Status201Created);

            app.MapPost("/budgetLists/{budgetListId}/budgetItems", PostBudgetItem)
                .WithName("CreateBudgetItem")
                .WithSummary("Create a new budget item for a budget list")
                .WithDescription("Create a new budget item for a specific budget list and return the created item")
                .WithTags("BudgetLists")
                .Produces<BudgetItem>(StatusCodes.Status201Created)
                .Produces(StatusCodes.Status404NotFound);

            app.MapPut("/budgetLists/{budgetListId}", PutBudgetList)
                .WithName("UpdateBudgetList")
                .WithSummary("Update a budget list")
                .WithDescription("Update the details of a specific budget list")
                .WithTags("BudgetLists")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);

            app.MapDelete("/budgetLists/{budgetListId}", DeleteBudgetList)
                .WithName("DeleteBudgetList")
                .WithSummary("Delete a budget list")
                .WithDescription("Delete a specific budget list by its ID")
                .WithTags("BudgetLists")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);
        }

        private static async Task<IResult> GetAllBudgetLists(int dashboardId, TaskFlowDBContext db)
        {
            var budgetLists = await db.BudgetLists
                .Where(bl => bl.DashboardId == dashboardId)
                .Include(bl => bl.Items)
                .ToListAsync();

            return budgetLists.Any() ? Results.Ok(budgetLists) : Results.NotFound("No budget lists found for the specified dashboard.");
        }

        private static async Task<IResult> GetBudgetListById(int budgetListId, TaskFlowDBContext db)
        {
            var budgetList = await db.BudgetLists
                .Include(bl => bl.Items)
                .FirstOrDefaultAsync(bl => bl.Id == budgetListId);

            return budgetList is not null ? Results.Ok(budgetList) : Results.NotFound($"Budget List with ID {budgetListId} not found.");
        }

        private static async Task<IResult> PostBudgetList(BudgetList budgetList, TaskFlowDBContext db)
        {
            if (budgetList is null)
            {
                return Results.BadRequest("Budget list cannot be null.");
            }

            await db.BudgetLists.AddAsync(budgetList);
            await db.SaveChangesAsync();

            return Results.Created($"/budgetLists/{budgetList.Id}", budgetList);
        }

        private static async Task<IResult> PutBudgetList(int budgetListId, BudgetList updatedBudgetList, TaskFlowDBContext db)
        {
            var budgetList = await db.BudgetLists.FindAsync(budgetListId);

            if (budgetList is null)
            {
                return Results.NotFound($"Budget List with ID {budgetListId} not found.");
            }

            budgetList.Name = updatedBudgetList.Name; // Update the properties you need to change
            await db.SaveChangesAsync();

            return Results.NoContent();
        }

        private static async Task<IResult> DeleteBudgetList(int budgetListId, TaskFlowDBContext db)
        {
            var budgetList = await db.BudgetLists.FindAsync(budgetListId);

            if (budgetList is null)
            {
                return Results.NotFound($"Budget List with ID {budgetListId} not found.");
            }

            db.BudgetLists.Remove(budgetList);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }

        private static async Task<IResult> PostBudgetItem(int budgetListId, BudgetItem budgetItem, TaskFlowDBContext db)
        {
            var budgetList = await db.BudgetLists.FindAsync(budgetListId);

            if (budgetList is null)
            {
                return Results.NotFound($"Budget List with ID {budgetListId} not found.");
            }

            budgetItem.BudgetListId = budgetListId;
            await db.BudgetItems.AddAsync(budgetItem);
            await db.SaveChangesAsync();

            return Results.Created($"/budgetLists/{budgetListId}/budgetItems/{budgetItem.Id}", budgetItem);
        }
    }
}
