namespace FixTrack.Core;
public class MemoryIssueRepository : IIssueRepository
{
private readonly List<Issue> issues = new();
private int nextId = 1;
public List<Issue> GetAll() => issues.ToList();
public Issue? GetById(int id)
=> issues.FirstOrDefault(i => i.Id == id);
public Issue Add(Issue issue)
{
issue.Id = nextId++;
issues.Add(issue);
return issue;
}
public void Update(Issue issue)
{
// Objektet i listan är redan ändrat.
}
public bool Delete(int id)
=> issues.RemoveAll(i => i.Id == id) > 0;
}
