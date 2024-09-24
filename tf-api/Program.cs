using Microsoft.EntityFrameworkCore;
using tf_api.DBContexts; // F�r att anv�nda DBContexts
using tf_api.Endpoints; // F�r att anv�nda Endpoints;

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
    });
});

// L�gg till CORS-konfiguration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                         .AllowAnyMethod() // Till�t alla metoder
                         .AllowAnyHeader()); // Till�t alla headers
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

// H�r kan du definiera dina API-endpoints
app.MapDashboardEndpoints();

app.Run();