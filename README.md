## Deployment with Coolify

This repository is a plain static site (HTML, CSS, JS) with no build step. It is ready to be deployed directly from Git using Coolify's **Static** build pack.

### Coolify configuration

- **Type**: Application from Git repository
- **Build pack**: Nixpacks → **Static**
- **Base directory**: `/`  
  (since `index.html` and other assets live at the repo root and subfolders)
- **Build command**: _leave empty_ (no build needed)
- **Publish directory**: `/`  
- **Web server**: `nginx` (default)
- **Port**: use the default that Coolify assigns for static apps

### Steps to deploy

1. **Create resource** in Coolify  
   - Go to your project in Coolify → **Create New Resource** → **Public Repository** (or the appropriate Git provider option for a private repo).
2. **Repository URL**  
   - Use this repo's HTTPS Git URL (e.g. `https://github.com/<user>/mikesilvis.github.io.git`).
3. **Static build pack**  
   - When prompted for build pack, select **Static** and set:
     - **Base directory**: `/`
     - **Publish directory**: `/`
4. **Domain**  
   - Add your desired domain (e.g. `mike-silvis.example.com`), or multiple domains separated by commas.
5. **Deploy**  
   - Click **Deploy**. Coolify will detect there is no build step, serve the static files via Nginx, and your site will be live once the deployment finishes.

Whenever you push changes to this repository, you can configure Coolify to auto-deploy (via its Git integration / webhooks), or trigger deployments manually from the Coolify UI.

