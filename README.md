# FixTrack

A small issue tracker: a C# / .NET 10 backend with SQLite (Entity Framework Core) and a Next.js frontend.

## Project structure

| Folder | Description |
| --- | --- |
| `FixTrack.Core` | Domain model (`Issue`), business logic (`IssueService`), and repositories (SQLite via EF Core, plus an in-memory version) |
| `FixTrack.Api` | ASP.NET Core minimal API with Swagger |
| `FixTrack.Console` | Console app that lists open issues and prints the generated SQL |
| `frontend` | Next.js 15 / React 19 web UI |
| `postman` | Postman collection for testing the API |

## Requirements

- [.NET SDK 10.0.404](https://dotnet.microsoft.com/download) (pinned in `global.json`)
- [Node.js](https://nodejs.org/) 20 or later

## Getting started

### 1. Start the API

```bash
cd FixTrack.Api
dotnet run --urls http://localhost:5050
```

The SQLite database (`fixtrack.db`) is created automatically on first start.
Swagger UI is available at http://localhost:5050/swagger.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

By default the frontend calls the API at `http://localhost:5050`. To use a different address, set `NEXT_PUBLIC_API_URL` (for example in `frontend/.env.local`).

### Console app (optional)

```bash
cd FixTrack.Console
dotnet run
```

## API endpoints

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/issues?status=new\|resolved` | List issues sorted by priority (status filter is optional) |
| `POST` | `/api/issues` | Create an issue. Body: `{ "title": "...", "priority": 1 }` |
| `PATCH` | `/api/issues/{id}/resolve` | Mark an issue as resolved |
| `DELETE` | `/api/issues/{id}` | Delete an issue |

### Validation rules

- `title` must be at least 3 characters long.
- `priority` must be between 1 and 3.

Invalid requests return `400 Bad Request` with `{ "error": "..." }`.
