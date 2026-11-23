using FixTrack.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IIssueRepository, SqliteIssueRepository>();
builder.Services.AddScoped<IssueService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("Frontend");

using (var db = new FixTrackDb())
{
    db.Database.EnsureCreated();
}

app.MapGet("/api/health", () =>
    Results.Ok(new { message = "Backend fungerar" }));

app.MapGet("/api/issues", (string? status, IssueService service) =>
{
    try
    {
        return Results.Ok(service.GetIssues(status));
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapPost("/api/issues", (CreateIssueRequest request, IssueService service) =>
{
    try
    {
        var issue = service.Create(request.Title ?? "", request.Priority);
        return Results.Ok(issue);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapPatch("/api/issues/{id:int}/resolve", (int id, IssueService service) =>
{
    return service.Resolve(id)
        ? Results.NoContent()
        : Results.NotFound(new { error = "Ärendet finns inte." });
});

app.MapDelete("/api/issues/{id:int}", (int id, IssueService service) =>
{
    return service.Delete(id)
        ? Results.NoContent()
        : Results.NotFound(new { error = "Ärendet finns inte." });
});

app.Run();

record CreateIssueRequest(string? Title, int Priority);
