using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.SwaggerUI;
using tf_api.DBContexts; 
using tf_api.Endpoints; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TaskFlowDBContext>();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "TaskFlow API",
        Version = "v1",
        Contact = new() { Name = "TaskKing", Email = "taskking@trams.org" }
    });
});

// L�gg till CORS-konfiguration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                         .AllowAnyMethod() 
                         .AllowAnyHeader()); 
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.DocExpansion(DocExpansion.List);
        options.DefaultModelsExpandDepth(-1);
    });
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Aktivera CORS
app.UseCors("AllowAllOrigins");


app.MapDashboardEndpoints();
app.MapTodoListEndpoints();
app.MapNotepadEndpoints();
app.MapBudgetListEndpoints();

app.Run();
