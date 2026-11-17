# URLProbe Studio (frontend)

React + Vite + Tailwind CSS v3 + shadcn/ui. Talks to the separate UrlProbe FastAPI backend.

## Setup

Requires Node 20.19+ (or 22+).

```bash
npm install
npm run ui:install        # downloads the shadcn components into src/components/ui
cp .env.example .env      # set VITE_API_BASE_URL if the backend isn't on :8000
npm run dev
```

## Connecting MetaProbe

All backend route details live in `src/config/endpoints.js`. Verify the path,
HTTP method and parameter name against your FastAPI route. The response is
grouped in `src/utils/metadata.js`.

Your backend must allow this origin with CORS (default dev origin: http://localhost:5173).

## Where things live

- `config/`: navigation tree, library list and links, endpoints
- `services/`: all fetch calls
- `hooks/`: state logic (`useMetaProbe`, `useApiStatus`, `useActivity`)
- `components/ui/`: shadcn components (generated)
- `components/layout|common|tools|ecosystem/`: our own components
- `pages/`: one file per route
