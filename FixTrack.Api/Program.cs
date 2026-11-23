using FixTrack.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IIssueRepository, SqliteIssueRepository>();
builder.Services.AddScoped<IssueService>();

var app = builder.Build();

using (var db = new FixTrackDb())
{
    db.Database.EnsureCreated();
}

app.MapGet("/api/issues", (string? status, IssueService service) =>
    Results.Ok(service.GetIssues(status)));

app.MapPost("/api/issues", (CreateIssueRequest request, IssueService service) =>
{
    try
    {
        var issue = service.Create(request.Title, request.Priority);
        return Results.Ok(issue);
    }
    catch (ArgumentException exception)
    {
        return Results.BadRequest(new { error = exception.Message });
    }
});

app.Run();

record CreateIssueRequest(string Title, int Priority);
