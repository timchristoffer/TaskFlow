using tf_api.DBContexts;
using tf_api.Models;
using Microsoft.EntityFrameworkCore;

namespace tf_api.Endpoints
{
    public static class BudgetEndpoints
    {
        //remove big L below
        public static void MapBudgetListEndpoints(this WebApplication app)
        {
            app.MapGet("/budgetLists", GetAllBudgetLists);
            app.MapGet("/budgetLists/{budgetListId}", GetBudgetListById);

            app.MapPost("/budgetLists", PostBudgetList);
            app.MapPost("/budgetList/{budgetListId}/budgetItems", PostBudgetItem);

            app.MapPut("/budgetLists/{budgetListId}", PutBudgetList);

            app.MapDelete("/budgetLists/{budgetListId}", DeleteBudgetList);
        }

        private static async Task<IResult> GetAllBudgetLists(int dashboardId, TaskFlowDBContext db)
        {
            var result = await db.BudgetLists
                .Where(bl => bl.DashboardId == dashboardId)
                .Include(bl => bl.Items)
                .ToListAsync()
                is List<BudgetList> budgetLists
                ? Results.Ok(budgetLists)
                : Results.NotFound("Couldn't find list");
            //add notfound return
            return result;
        }

        private static async Task<IResult> GetBudgetListById(TaskFlowDBContext db, int budgetListId)
        {
            var budgetList = await db.BudgetLists
                .Where(bl => bl.Id == budgetListId)
                .Include(bl => bl.Items)
                .FirstOrDefaultAsync();

            if (budgetList == null)
            {
                return Results.NotFound($"Budget List with ID {budgetListId} not found.");
            }

            return Results.Ok(budgetList);
        }

        private static async Task<IResult> PostBudgetList(BudgetList budgetList, TaskFlowDBContext db)
        {
            if (budgetList == null)
            {
                return Results.BadRequest("Budget list can not be null.");
            }

            await db.BudgetLists.AddAsync(budgetList);
            await db.SaveChangesAsync();

            return Results.Created("Budget list created: ", budgetList);
        }

        private static async Task<IResult> PutBudgetList(TaskFlowDBContext db, int budgetListId, BudgetList updatedBudgetList)
        {
            var budgetList = await db.BudgetLists
                .Where(bl => bl.Id == budgetListId)
                .FirstOrDefaultAsync();

            if (budgetList == null)
            {
                return Results.NotFound($"Budget List with ID {budgetListId} not found.");
            }

            budgetList = updatedBudgetList;

            await db.SaveChangesAsync();

            return Results.Ok(budgetList);
        }

        private static async Task<IResult> DeleteBudgetList(TaskFlowDBContext db, int budgetListId)
        {
            var budgetList = await db.BudgetLists
                .Where(bl => bl.Id == budgetListId)
                .FirstOrDefaultAsync();

            if (budgetList == null)
            {
                return Results.NotFound($"Budget List with ID {budgetListId} not found.");
            }

            db.BudgetLists.Remove(budgetList);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }

        private static async Task<IResult> PostBudgetItem(int budgetListId, BudgetItem budgetItem, TaskFlowDBContext db)
        {
            var budgetList = await db.BudgetLists
                .Where(bl => bl.Id == budgetListId)
                .FirstOrDefaultAsync();

            if (budgetList == null)
            {
                return Results.NotFound();
            }

            budgetItem.BudgetListId = budgetListId;

            db.BudgetItems.Add(budgetItem);

            await db.SaveChangesAsync();
            return Results.Created();
        }
    }
}
