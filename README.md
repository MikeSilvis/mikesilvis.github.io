## Deployment with Coolify

This repository is a Node.js (Express) application that serves both static site files and a wrestling results API. It uses a `Dockerfile` at the repo root for deployment.

### Architecture

A single Docker container runs Express which:
- Serves all static files (HTML, CSS, JS) from the repo root
- Provides `/api/results/:tournamentId` endpoints that fetch and parse TrackWrestling HTML server-side
- Caches results in memory with a 60-second TTL

### Local development

```bash
mise install          # Install Node 20
mise run install      # Install npm dependencies
mise run server       # Start server at http://localhost:3000
```

### Coolify configuration

- **Type**: Application from Git repository
- **Build pack**: **Dockerfile**
- **Dockerfile location**: `Dockerfile` (repo root)
- **Port**: `3000`

### Steps to deploy

1. **Create resource** in Coolify
   - Go to your project in Coolify -> **Create New Resource** -> **Public Repository** (or the appropriate Git provider option for a private repo).
2. **Repository URL**
   - Use this repo's HTTPS Git URL (e.g. `https://github.com/<user>/mikesilvis.github.io.git`).
3. **Dockerfile build pack**
   - When prompted for build pack, select **Dockerfile**.
   - Ensure the Dockerfile path is set to `Dockerfile` at the repo root.
   - Set the exposed port to `3000`.
4. **Domain**
   - Add your desired domain (e.g. `mike-silvis.example.com`), or multiple domains separated by commas.
5. **Deploy**
   - Click **Deploy**. Coolify will build the Docker image and start the container.

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/results/:tournamentId` - All weight classes as JSON
- `GET /api/results/:tournamentId/:weight` - Single weight class

Whenever you push changes to this repository, you can configure Coolify to auto-deploy (via its Git integration / webhooks), or trigger deployments manually from the Coolify UI.

