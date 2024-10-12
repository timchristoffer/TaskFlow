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
            app.MapGet("/notepads", GetNotepadsForDashboard)
                .WithName("GetNotepadsForDashboard")
                .WithSummary("Get all notepads for a specific dashboard")
                .WithDescription("Retrieve a list of all notepads for a specific dashboard including their notes")
                .WithTags("Notepads")
                .Produces<List<Notepad>>(StatusCodes.Status200OK);

            app.MapGet("/notepads/{id}", GetNotepadById)
                .WithName("GetNotepadById")
                .WithSummary("Get notepad by ID")
                .WithDescription("Retrieve a specific notepad by its ID including its notes")
                .WithTags("Notepads")
                .Produces<Notepad>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            app.MapPost("/notepads", CreateNotepad)
                .WithName("CreateNotepad")
                .WithSummary("Create a new notepad")
                .WithDescription("Create a new notepad and return the created notepad")
                .WithTags("Notepads")
                .Produces<Notepad>(StatusCodes.Status201Created);

            app.MapPost("/notepads/{notepadId}/notes", CreateNoteForNotepad)
                .WithName("CreateNoteForNotepad")
                .WithSummary("Create a new note for a notepad")
                .WithDescription("Create a new note for a specific notepad and return the created note")
                .WithTags("Notepads")
                .Produces<Note>(StatusCodes.Status201Created)
                .Produces(StatusCodes.Status404NotFound);

            app.MapPut("/notepads/{notepadId}/notes/{noteId}", UpdateNoteForNotepad)
                .WithName("UpdateNoteForNotepad")
                .WithSummary("Update a note for a notepad")
                .WithDescription("Update the details of a specific note for a specific notepad")
                .WithTags("Notepads")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);

            app.MapDelete("/notepads/{notepadId}/notes/{noteId}", DeleteNoteForNotepad)
                .WithName("DeleteNoteForNotepad")
                .WithSummary("Delete a note for a notepad")
                .WithDescription("Delete a specific note by its ID for a specific notepad")
                .WithTags("Notepads")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);

            app.MapPut("/notepads/{id}", UpdateNotepad)
                .WithName("UpdateNotepad")
                .WithSummary("Update a notepad")
                .WithDescription("Update the details of a specific notepad")
                .WithTags("Notepads")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);

            app.MapDelete("/notepads/{id}", DeleteNotepad)
                .WithName("DeleteNotepad")
                .WithSummary("Delete a notepad")
                .WithDescription("Delete a specific notepad by its ID")
                .WithTags("Notepads")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status404NotFound);
        }

        private static async Task<IResult> GetNotepadsForDashboard(int dashboardId, TaskFlowDBContext db)
        {
            var notepads = await db.Notepads
                .Where(n => n.DashboardId == dashboardId)
                .Include(n => n.Notes)
                .ToListAsync();
            return Results.Ok(notepads);
        }

        private static async Task<IResult> GetNotepadById(int id, TaskFlowDBContext db)
        {
            var notepad = await db.Notepads
                .Include(n => n.Notes)
                .FirstOrDefaultAsync(n => n.Id == id);
            return notepad is not null ? Results.Ok(notepad) : Results.NotFound();
        }

        private static async Task<IResult> CreateNotepad(Notepad notepad, TaskFlowDBContext db)
        {
            db.Notepads.Add(notepad);
            await db.SaveChangesAsync();
            return Results.Created($"/notepads/{notepad.Id}", notepad);
        }

        private static async Task<IResult> CreateNoteForNotepad(int notepadId, Note note, TaskFlowDBContext db)
        {
            var notepad = await db.Notepads.FindAsync(notepadId);
            if (notepad is null)
            {
                return Results.NotFound();
            }

            note.NotepadId = notepadId;
            db.Notes.Add(note);
            await db.SaveChangesAsync();
            return Results.Created($"/notepads/{notepadId}/notes/{note.Id}", note);
        }

        private static async Task<IResult> UpdateNoteForNotepad(int notepadId, int noteId, Note updatedNote, TaskFlowDBContext db)
        {
            var note = await db.Notes
                .Where(n => n.NotepadId == notepadId && n.Id == noteId)
                .FirstOrDefaultAsync();
            if (note is null) return Results.NotFound();

            note.Text = updatedNote.Text;
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        private static async Task<IResult> DeleteNoteForNotepad(int notepadId, int noteId, TaskFlowDBContext db)
        {
            var note = await db.Notes
                .Where(n => n.NotepadId == notepadId && n.Id == noteId)
                .FirstOrDefaultAsync();
            if (note is null) return Results.NotFound();

            db.Notes.Remove(note);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        private static async Task<IResult> UpdateNotepad(int id, Notepad updatedNotepad, TaskFlowDBContext db)
        {
            var notepad = await db.Notepads.FindAsync(id);
            if (notepad is null) return Results.NotFound();

            notepad.Name = updatedNotepad.Name;
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        private static async Task<IResult> DeleteNotepad(int id, TaskFlowDBContext db)
        {
            var notepad = await db.Notepads.FindAsync(id);
            if (notepad is null) return Results.NotFound();

            db.Notepads.Remove(notepad);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }
    }
}