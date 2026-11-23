namespace FixTrack.Core;
public interface IIssueRepository
{
List<Issue> GetAll();
Issue? GetById(int id);
Issue Add(Issue issue);
void Update(Issue issue);
bool Delete(int id);
}
