using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using tf_api.DBContexts;
using tf_api.Models;

namespace tf_api.Endpoints
{
    public static class NotepadEndpoints
    {
        public static void MapNotepadEndpoints(this WebApplication app)
        {
            // Get all notepads for a specific dashboard
            app.MapGet("/dashboards/{dashboardId}/notepads", async (int dashboardId, TaskFlowDBContext db) =>
            {
                return await db.Notepads
                    .Where(n => n.DashboardId == dashboardId)
                    .Include(n => n.Notes)
                    .ToListAsync();
            })
            .WithName("GetAllNotepads")
            .WithSummary("Get all notepads for a specific dashboard")
            .WithDescription("Retrieve a list of all notepads for a specific dashboard including their notes")
            .WithTags("Notepads")
            .Produces<List<Notepad>>(StatusCodes.Status200OK);

            // Get a specific notepad by ID for a specific dashboard
            app.MapGet("/dashboards/{dashboardId}/notepads/{id}", async (int dashboardId, int id, TaskFlowDBContext db) =>
            {
                var notepad = await db.Notepads
                    .Where(n => n.DashboardId == dashboardId && n.Id == id)
                    .Include(n => n.Notes)
                    .FirstOrDefaultAsync();
                return notepad is not null ? Results.Ok(notepad) : Results.NotFound();
            })
            .WithName("GetNotepadById")
            .WithSummary("Get notepad by ID for a specific dashboard")
            .WithDescription("Retrieve a specific notepad by its ID for a specific dashboard including its notes")
            .WithTags("Notepads")
            .Produces<Notepad>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

            // Create a new notepad for a specific dashboard
            app.MapPost("/dashboards/{dashboardId}/notepads", async (int dashboardId, Notepad notepad, TaskFlowDBContext db) =>
            {
                notepad.DashboardId = dashboardId;
                db.Notepads.Add(notepad);
                await db.SaveChangesAsync();
                return Results.Created($"/dashboards/{dashboardId}/notepads/{notepad.Id}", notepad);
            })
            .WithName("CreateNotepad")
            .WithSummary("Create a new notepad for a specific dashboard")
            .WithDescription("Create a new notepad for a specific dashboard and return the created notepad")
            .WithTags("Notepads")
            .Produces<Notepad>(StatusCodes.Status201Created);

            // Create a new note for a notepad in a specific dashboard
            app.MapPost("/dashboards/{dashboardId}/notepads/{notepadId}/notes", async (int dashboardId, int notepadId, Note note, TaskFlowDBContext db) =>
            {
                var notepad = await db.Notepads
                    .Where(n => n.DashboardId == dashboardId && n.Id == notepadId)
                    .FirstOrDefaultAsync();
                if (notepad is null)
                {
                    return Results.NotFound();
                }

                note.NotepadId = notepadId;
                db.Notes.Add(note);
                await db.SaveChangesAsync();
                return Results.Created($"/dashboards/{dashboardId}/notepads/{notepadId}/notes/{note.Id}", note);
            })
            .WithName("CreateNoteForNotepad")
            .WithSummary("Create a new note for a notepad in a specific dashboard")
            .WithDescription("Create a new note for a specific notepad in a specific dashboard and return the created note")
            .WithTags("Notepads")
            .Produces<Note>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status404NotFound);

            // Update a note for a specific notepad in a specific dashboard
            app.MapPut("/dashboards/{dashboardId}/notepads/{notepadId}/notes/{noteId}", async (int dashboardId, int notepadId, int noteId, Note updatedNote, TaskFlowDBContext db) =>
            {
                var notepad = await db.Notepads
                    .Where(n => n.DashboardId == dashboardId && n.Id == notepadId)
                    .FirstOrDefaultAsync();
                if (notepad is null) return Results.NotFound();

                var note = await db.Notes
                    .Where(n => n.NotepadId == notepadId && n.Id == noteId)
                    .FirstOrDefaultAsync();
                if (note is null) return Results.NotFound();

                note.Text = updatedNote.Text;
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("UpdateNoteForNotepad")
            .WithSummary("Update a note for a notepad in a specific dashboard")
            .WithDescription("Update the details of a specific note for a specific notepad in a specific dashboard")
            .WithTags("Notepads")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

            // Delete a note for a specific notepad in a specific dashboard
            app.MapDelete("/dashboards/{dashboardId}/notepads/{notepadId}/notes/{noteId}", async (int dashboardId, int notepadId, int noteId, TaskFlowDBContext db) =>
            {
                var notepad = await db.Notepads
                    .Where(n => n.DashboardId == dashboardId && n.Id == notepadId)
                    .FirstOrDefaultAsync();
                if (notepad is null) return Results.NotFound();

                var note = await db.Notes
                    .Where(n => n.NotepadId == notepadId && n.Id == noteId)
                    .FirstOrDefaultAsync();
                if (note is null) return Results.NotFound();

                db.Notes.Remove(note);
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("DeleteNoteForNotepad")
            .WithSummary("Delete a note for a notepad in a specific dashboard")
            .WithDescription("Delete a specific note by its ID for a specific notepad in a specific dashboard")
            .WithTags("Notepads")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

            // Update a notepad for a specific dashboard
            app.MapPut("/dashboards/{dashboardId}/notepads/{id}", async (int dashboardId, int id, Notepad updatedNotepad, TaskFlowDBContext db) =>
            {
                var notepad = await db.Notepads
                    .Where(n => n.DashboardId == dashboardId && n.Id == id)
                    .FirstOrDefaultAsync();
                if (notepad is null) return Results.NotFound();

                notepad.Name = updatedNotepad.Name;
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("UpdateNotepad")
            .WithSummary("Update a notepad for a specific dashboard")
            .WithDescription("Update the details of a specific notepad for a specific dashboard")
            .WithTags("Notepads")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

            // Delete a notepad for a specific dashboard
            app.MapDelete("/dashboards/{dashboardId}/notepads/{id}", async (int dashboardId, int id, TaskFlowDBContext db) =>
            {
                var notepad = await db.Notepads
                    .Where(n => n.DashboardId == dashboardId && n.Id == id)
                    .FirstOrDefaultAsync();
                if (notepad is null) return Results.NotFound();

                db.Notepads.Remove(notepad);
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("DeleteNotepad")
            .WithSummary("Delete a notepad for a specific dashboard")
            .WithDescription("Delete a specific notepad by its ID for a specific dashboard")
            .WithTags("Notepads")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
        }
    }
}