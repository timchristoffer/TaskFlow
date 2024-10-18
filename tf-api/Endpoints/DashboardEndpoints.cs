using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using tf_api.DBContexts;
using tf_api.Models;

namespace tf_api.Endpoints
{
    public static class DashboardEndpoints
    {
        public static void MapDashboardEndpoints(this WebApplication app)
        {
            // Get all dashboards
            app.MapGet("/dashboards", GetAllDashboards)
                .WithName("GetAllDashboards")
                .WithSummary("Get all dashboards")
                .WithDescription("Retrieve a list of all dashboards")
                .WithTags("Dashboards")
                .Produces<List<Dashboard>>(StatusCodes.Status200OK);

            // Get a specific dashboard by ID
            app.MapGet("/dashboards/{id}", GetDashboardById)
                .WithName("GetDashboardById")
                .WithSummary("Get dashboard by ID")
                .WithDescription("Retrieve a specific dashboard by its ID")
                .WithTags("Dashboards")
                .Produces<Dashboard>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            // Create a new dashboard
            app.MapPost("/dashboards", CreateDashboard)
                .WithName("CreateDashboard")
                .WithSummary("Create a new dashboard")
                .WithDescription("Create a new dashboard and return the created dashboard")
                .WithTags("Dashboards")
                .Produces<Dashboard>(StatusCodes.Status201Created);

            // Update an existing dashboard
            app.MapPut("/dashboards/{id}", UpdateDashboard)
                .WithName("UpdateDashboard")
                .WithSummary("Update a dashboard")
                .WithDescription("Update the details of a specific dashboard")
                .WithTags("Dashboards")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);

            // Delete a dashboard
            app.MapDelete("/dashboards/{id}", DeleteDashboard)
                .WithName("DeleteDashboard")
                .WithSummary("Delete a dashboard")
                .WithDescription("Delete a specific dashboard by its ID")
                .WithTags("Dashboards")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);
        }

        private static async Task<IResult> GetAllDashboards(TaskFlowDBContext db)
        {
            var dashboards = await db.Dashboards.ToListAsync();
            return Results.Ok(dashboards);
        }

        private static async Task<IResult> GetDashboardById(int id, TaskFlowDBContext db)
        {
            var dashboard = await db.Dashboards.FindAsync(id);
            return dashboard is not null ? Results.Ok(dashboard) : Results.NotFound();
        }

        private static async Task<IResult> CreateDashboard(Dashboard dashboard, TaskFlowDBContext db)
        {
            db.Dashboards.Add(dashboard);
            await db.SaveChangesAsync();
            return Results.Created($"/dashboards/{dashboard.Id}", dashboard);
        }

        private static async Task<IResult> UpdateDashboard(int id, Dashboard updatedDashboard, TaskFlowDBContext db)
        {
            var dashboard = await db.Dashboards.FindAsync(id);
            if (dashboard is null) return Results.NotFound();

            dashboard.Name = updatedDashboard.Name;
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        private static async Task<IResult> DeleteDashboard(int id, TaskFlowDBContext db)
        {
            var dashboard = await db.Dashboards.FindAsync(id);
            if (dashboard is null) return Results.NotFound();

            db.Dashboards.Remove(dashboard);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }
    }
}
