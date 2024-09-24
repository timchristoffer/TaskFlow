using Microsoft.EntityFrameworkCore;
using tf_api.DBContexts; // För att använda DBContexts
using tf_api.Endpoints; // För att använda Endpoints

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TaskFlowDBContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Här kan du definiera dina API-endpoints
app.MapDashboardEndpoints();

app.Run();
