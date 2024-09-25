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
            app.MapGet("/notepads", async (TaskFlowDBContext db) =>
            {
                return await db.Notepads.Include(n => n.Notes).ToListAsync();
            })
            .WithName("GetAllNotepads")
            .WithSummary("Get all notepads")
            .WithDescription("Retrieve a list of all notepads including their notes")
            .WithTags("Notepads")
            .Produces<List<Notepad>>(StatusCodes.Status200OK);

            app.MapGet("/notepads/{id}", async (int id, TaskFlowDBContext db) =>
            {
                var notepad = await db.Notepads.Include(n => n.Notes).FirstOrDefaultAsync(n => n.Id == id);
                return notepad is not null ? Results.Ok(notepad) : Results.NotFound();
            })
            .WithName("GetNotepadById")
            .WithSummary("Get notepad by ID")
            .WithDescription("Retrieve a specific notepad by its ID including its notes")
            .WithTags("Notepads")
            .Produces<Notepad>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

            app.MapPost("/notepads", async (Notepad notepad, TaskFlowDBContext db) =>
            {
                db.Notepads.Add(notepad);
                await db.SaveChangesAsync();
                return Results.Created($"/notepads/{notepad.Id}", notepad);
            })
            .WithName("CreateNotepad")
            .WithSummary("Create a new notepad")
            .WithDescription("Create a new notepad and return the created notepad")
            .WithTags("Notepads")
            .Produces<Notepad>(StatusCodes.Status201Created);

            app.MapPost("/notepads/{notepadId}/notes", async (int notepadId, Note note, TaskFlowDBContext db) =>
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
            })
            .WithName("CreateNoteForNotepad")
            .WithSummary("Create a new note for a notepad")
            .WithDescription("Create a new note for a specific notepad and return the created note")
            .WithTags("Notepads")
            .Produces<Note>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status404NotFound);

            app.MapPut("/notepads/{id}", async (int id, Notepad updatedNotepad, TaskFlowDBContext db) =>
            {
                var notepad = await db.Notepads.FindAsync(id);
                if (notepad is null) return Results.NotFound();

                notepad.Name = updatedNotepad.Name;
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("UpdateNotepad")
            .WithSummary("Update a notepad")
            .WithDescription("Update the details of a specific notepad")
            .WithTags("Notepads")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

            app.MapDelete("/notepads/{id}", async (int id, TaskFlowDBContext db) =>
            {
                var notepad = await db.Notepads.FindAsync(id);
                if (notepad is null) return Results.NotFound();

                db.Notepads.Remove(notepad);
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("DeleteNotepad")
            .WithSummary("Delete a notepad")
            .WithDescription("Delete a specific notepad by its ID")
            .WithTags("Notepads")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
        }
    }
}