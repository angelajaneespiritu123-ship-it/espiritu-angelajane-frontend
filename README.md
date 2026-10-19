# Kanto Sari-Sari Store

React and Vite frontend for the Kanto Store inventory API.

## Local development

Install dependencies and start the frontend:

```sh
npm install
npm run dev
```

The Vite development server proxies `/api` requests to `http://127.0.0.1:8001`.
Start the PHP API from `LavalustAPI` in a separate terminal:

```sh
php -S 127.0.0.1:8001 index.php
```

## Vercel deployment

`vercel.json` proxies `/api/*` requests through Vercel to the deployed Render API.
This keeps browser requests on the Vercel origin and avoids cross-origin CORS
preflight failures. Production builds use this proxy automatically; do not set
`VITE_API_URL` in Vercel.

After changing the API host in `vercel.json`, redeploy the Vercel project.
