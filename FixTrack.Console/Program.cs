using FixTrack.Core;
using Microsoft.EntityFrameworkCore;

using (var db = new FixTrackDb())
{
    db.Database.EnsureCreated();
}

var repository = new SqliteIssueRepository();
var service = new IssueService(repository);

foreach (var issue in service.GetIssues("new"))
{
    Console.WriteLine(
        $"{issue.Id}: {issue.Title} | " +
        $"P{issue.Priority} | " +
        service.GetStatusLabel(issue.Status));
}

using (var db = new FixTrackDb())
{
    var query = db.Issues
        .AsNoTracking()
        .Where(issue => issue.Status == "new")
        .OrderBy(issue => issue.Priority)
        .ThenBy(issue => issue.Id);

    Console.WriteLine(query.ToQueryString());

    var selected = query.ToList();
    foreach (var issue in selected)
    {
        Console.WriteLine(issue.Title);
    }
}