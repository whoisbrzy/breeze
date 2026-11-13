# Breeze bot (Pterodactyl)

The website is deployed separately on Vercel. This directory contains the persistent Discord bot process.

## Pterodactyl setup

1. Create a server using a supported Node.js egg/runtime (Node.js 20 or newer).
2. Upload or clone this repository into the server.
3. Set the startup command to `npm run bot:start`.
4. Ensure the server installs dependencies with `npm install`.
5. Add the environment variables listed in the repository's `.env.example` through the server's environment/startup settings.
6. Start the server and check the console for the successful login and command registration messages.

Required variables:
- `DISCORD_BOT_TOKEN`
- `DISCORD_CLIENT_ID`

Optional variables:
- `DISCORD_GUILD_ID` — register commands to one test server; omit for global commands.
- `OPENAI_API_KEY` — enables `/ask` and `/summarise`.
- `TENOR_API_KEY` — enables `/gif`.
- `PORT` — health API port, default 3001.
- `DASHBOARD_ORIGIN` — comma-separated allowed dashboard origins.

The process exposes `GET /health` on its allocated port. Assign a port in Pterodactyl if you need to access this endpoint externally.

## Security

Never commit a real `.env` file or paste bot tokens into source code. Rotate the Discord token immediately if it is ever exposed. Do not expose provider API keys in Vite variables or browser code.
