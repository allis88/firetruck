using Microsoft.EntityFrameworkCore;
namespace FixTrack.Core;
public class SqliteIssueRepository : IIssueRepository
{
public List<Issue> GetAll()
{
using var db = new FixTrackDb();
return db.Issues.AsNoTracking().ToList();
}
public Issue? GetById(int id)
{
using var db = new FixTrackDb();
return db.Issues.AsNoTracking()
.FirstOrDefault(i => i.Id == id);
}
public Issue Add(Issue issue)
{
using var db = new FixTrackDb();
db.Issues.Add(issue);
db.SaveChanges();
return issue;
}
public void Update(Issue issue)
{
using var db = new FixTrackDb();
db.Issues.Update(issue);
db.SaveChanges();
}
public bool Delete(int id)
{
using var db = new FixTrackDb();
return db.Issues.Where(i => i.Id == id)
.ExecuteDelete() > 0;
}
}
