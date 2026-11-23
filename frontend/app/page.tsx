"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Issue, IssueStatus } from "@/types/issue";
import {
  getIssues, createIssue, resolveIssue, deleteIssue,
} from "@/lib/issueApi";

type Filter = "all" | IssueStatus;

const statusLabels: Record<IssueStatus, string> = {
  new: "Ny",
  resolved: "Löst",
};

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : "Något gick fel.";
}

export default function Dashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(2);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    getIssues()
      .then((data) => { if (active) setIssues(data); })
      .catch((err: unknown) => {
        if (active) setError(errorText(err));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      setIssues(await getIssues());
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  }

  async function change(action: () => Promise<unknown>): Promise<boolean> {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
      return false;
    }
    try {
      setIssues(await getIssues());
    } catch {
      setError(
        "Ändringen sparades, men listan kunde inte " +
        "hämtas igen. Klicka på Uppdatera.",
      );
    } finally {
      setBusy(false);
    }
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length < 3) {
      setError("Skriv en titel med minst tre tecken.");
      return;
    }
    const saved = await change(() =>
      createIssue({ title: title.trim(), priority }),
    );
    if (saved) {
      setTitle("");
      setNotice("Ärendet har sparats.");
    }
  }

  const visibleIssues = issues.filter((issue) =>
    filter === "all" || issue.status === filter);
  const newCount = issues.filter(
    (issue) => issue.status === "new").length;
  const resolvedCount = issues.filter(
    (issue) => issue.status === "resolved").length;

  return (
    <main className="dashboard">
      <header>
        <p>TE4 · Fullstack</p>
        <h1>FixTrack</h1>
        <p>Registrera och följ tekniska fel.</p>
      </header>

      <section className="stats" aria-label="Statistik">
        <article className="panel">
          <h2>Totalt</h2><strong>{issues.length}</strong>
        </article>
        <article className="panel">
          <h2>Nya</h2><strong>{newCount}</strong>
        </article>
        <article className="panel">
          <h2>Lösta</h2><strong>{resolvedCount}</strong>
        </article>
      </section>

      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}

      <div className="columns">
        <section className="panel">
          <h2>Skapa ärende</h2>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={busy || loading}>
              <label htmlFor="title">Titel</label>
              <input id="title" value={title}
                onChange={(e) => setTitle(e.target.value)}
                minLength={3} required />
              <label htmlFor="priority">Prioritet</label>
              <select id="priority" value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}>
                <option value={1}>1 – Hög</option>
                <option value={2}>2 – Medel</option>
                <option value={3}>3 – Låg</option>
              </select>
              <button type="submit">
                {busy ? "Arbetar..." : "Skapa ärende"}
              </button>
            </fieldset>
          </form>
        </section>

        <section className="panel">
          <h2>Ärenden</h2>
          <div className="toolbar">
            <label htmlFor="filter">Visa status</label>
            <select id="filter" value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}>
              <option value="all">Alla</option>
              <option value="new">Nya</option>
              <option value="resolved">Lösta</option>
            </select>
            <button type="button" disabled={busy || loading}
              onClick={() => void refresh()}>Uppdatera</button>
          </div>

          {loading ? (
            <p role="status">Hämtar ärenden...</p>
          ) : visibleIssues.length === 0 ? (
            <p>Inga ärenden att visa.</p>
          ) : (
            <ul className="issue-list">
              {visibleIssues.map((issue) => (
                <li key={issue.id} className="issue">
                  <h3>{issue.title}</h3>
                  <p>
                    Prioritet {issue.priority} ·{" "}
                    {statusLabels[issue.status]}
                  </p>
                  <div className="actions">
                    {issue.status === "new" && (
                      <button type="button" disabled={busy}
                        onClick={() => {
                          void change(() => resolveIssue(issue.id));
                        }}>
                        Markera som löst
                      </button>
                    )}
                    <button type="button" className="danger"
                      disabled={busy} onClick={() => {
                        if (window.confirm(`Ta bort "${issue.title}"?`)) {
                          void change(() => deleteIssue(issue.id));
                        }
                      }}>
                      Ta bort
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
