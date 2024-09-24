using Microsoft.EntityFrameworkCore;
using tf_api.DBContexts; // För att använda DBContexts
using tf_api.Endpoints; // För att använda Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TaskFlowDBContext>();

// Lägg till CORS-konfiguration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                         .AllowAnyMethod() // Tillåt alla metoder
                         .AllowAnyHeader()); // Tillåt alla headers
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Aktivera CORS
app.UseCors("AllowAllOrigins");

// Här kan du definiera dina API-endpoints
app.MapDashboardEndpoints();

app.Run();
