# Todo App

React + Vite Todo application with Zoho Catalyst integration.

## Project Structure

```
/
├── catalyst.json              # Catalyst project config
├── .catalystrc                # Catalyst CLI auth (gitignored)
├── .env                       # Root Catalyst env vars
├── react-app/                 # React frontend
│   ├── package.json
│   ├── client-package.json    # Catalyst client config
│   ├── vite.config.js
│   ├── .env                   # React app env vars
│   ├── src/
│   │   ├── api/               # Axios client + API modules
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth context
│   │   ├── hooks/             # useAuth, useTodos
│   │   ├── pages/             # Login, Signup, Dashboard, Todos
│   │   ├── routes/            # App routing + protected routes
│   │   ├── services/          # Auth & todo services
│   │   ├── utils/             # Constants, helpers, storage
│   │   ├── catalyst.js        # Catalyst Web SDK init
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
├── functions/
│   └── to_do_app_function/    # Serverless API function
│       ├── index.js           # Auth + Todo API handlers
│       ├── package.json
│       └── catalyst-config.json
└── .build/                    # Catalyst build output
```

## Development

```bash
cd react-app
npm run dev
```

## Mock Mode

With `VITE_USE_MOCK=true` in `react-app/.env`, the app runs without a backend:

- **Login:** `test@example.com` / `password`
- **Signup:** any credentials

## Deployment (Catalyst)

```bash
zcatalyst deploy client
zcatalyst deploy function
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/signup` | User registration |
| GET | `/auth/me` | Current user |
| POST | `/auth/logout` | Logout |
| GET | `/todos` | List todos |
| POST | `/todos` | Create todo |
| PUT | `/todos/:id` | Update todo |
| DELETE | `/todos/:id` | Delete todo |
