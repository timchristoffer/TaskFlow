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
            app.MapGet("/dashboards", async (TaskFlowDBContext db) =>
            {
                return await db.Dashboards.ToListAsync();
            })
            .WithName("GetAllDashboards");

            app.MapGet("/dashboards/{id}", async (int id, TaskFlowDBContext db) =>
            {
                return await db.Dashboards.FindAsync(id)
                    is Dashboard dashboard
                        ? Results.Ok(dashboard)
                        : Results.NotFound();
            })
            .WithName("GetDashboardById");

            app.MapPost("/dashboards", async (Dashboard dashboard, TaskFlowDBContext db) =>
            {
                db.Dashboards.Add(dashboard);
                await db.SaveChangesAsync();
                return Results.Created($"/dashboards/{dashboard.Id}", dashboard);
            })
            .WithName("CreateDashboard");

            app.MapPut("/dashboards/{id}", async (int id, Dashboard updatedDashboard, TaskFlowDBContext db) =>
            {
                var dashboard = await db.Dashboards.FindAsync(id);
                if (dashboard is null) return Results.NotFound();

                dashboard.Name = updatedDashboard.Name;
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("UpdateDashboard");

            app.MapDelete("/dashboards/{id}", async (int id, TaskFlowDBContext db) =>
            {
                var dashboard = await db.Dashboards.FindAsync(id);
                if (dashboard is null) return Results.NotFound();

                db.Dashboards.Remove(dashboard);
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("DeleteDashboard");
        }
    }
}
