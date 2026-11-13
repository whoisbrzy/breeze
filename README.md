# Breeze

**Your space, connected.**

Breeze is a multipurpose Discord companion bringing music, games, developer tools, AI and everyday utilities into one place.

## Discord bot commands

| Command | What it does | Configuration |
| --- | --- | --- |
| `/ping` | Check bot latency | None |
| `/quote` | Get an inspirational quote | None |
| `/gif` | Search Tenor for a GIF | `TENOR_API_KEY` |
| `/ask` | Ask the Breeze AI assistant | `OPENAI_API_KEY` |
| `/summarise` | Summarise supplied text | `OPENAI_API_KEY` |
| `/crypto` | Look up a coin's price and 24h change | Public CoinGecko API |
| `/github` | View a public GitHub profile | Public GitHub API |
| `/roblox` | Look up a Roblox profile and avatar | Public Roblox APIs |
| `/lastfm` | Show a user's most recent track | `LASTFM_API_KEY` |
| `/spotify` | Search for a track, artist or album | Spotify app credentials |
| `/fortnite` | Look up public Battle Royale stats | `FORTNITE_API_KEY` |

Some integrations require their own API credentials. The bot tells you which environment variable is missing if a command is not configured.

## Stack

- React 18 + Vite 5 website
- Discord.js v14 bot
- Express health endpoint
- Node.js 18+ (Node 20 LTS recommended)

## Run the website locally

```bash
npm install
npm run dev
```

## Run the Discord bot

1. Copy `.env.example` to `.env`.
2. Add your Discord bot token and application/client ID.
3. Add API credentials for the integrations you want to enable.
4. Install dependencies with `npm install`.
5. Start the bot with:

```bash
npm run bot:start
```

For Pterodactyl, use the repository as the server's application files, set the required environment variables in the startup configuration, and use `npm install` followed by `npm run bot:start`. Set `DISCORD_GUILD_ID` while testing in one server; remove it to register commands globally.

## Environment variables

See [`.env.example`](.env.example) for the full list. Never commit a real `.env` file or put bot tokens/API secrets in frontend code.

## Health check

The bot exposes `GET /health` on the configured `PORT` (default `3001`). It reports Discord connection status and the registered command names.

## Current status

The bot command handlers and API integrations are implemented. Provider credentials still need to be added to the hosting environment before those specific integrations can run. The website's integration cards are currently informational previews.
