import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  Events,
  EmbedBuilder,
} from "discord.js";

const required = ["DISCORD_BOT_TOKEN", "DISCORD_CLIENT_ID"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const quotes = [
  "Small progress is still progress.",
  "Make it simple, but make it meaningful.",
  "Great things are built one step at a time.",
  "Consistency turns plans into results.",
  "Start where you are. Build from there.",
  "The best way out is always through. — Robert Frost",
  "It always seems impossible until it's done. — Nelson Mandela",
];

const command = (name, description) => new SlashCommandBuilder().setName(name).setDescription(description);
const commands = [
  command("ping", "Check Breeze's response time."),
  command("quote", "Get a little boost of inspiration."),
  command("gif", "Search for a GIF.")
    .addStringOption((o) => o.setName("search").setDescription("What should the GIF show?").setRequired(true).setMaxLength(80)),
  command("ask", "Ask Breeze AI a question.")
    .addStringOption((o) => o.setName("question").setDescription("Your question").setRequired(true).setMaxLength(1500)),
  command("summarise", "Summarise a piece of text.")
    .addStringOption((o) => o.setName("text").setDescription("Text to summarise").setRequired(true).setMaxLength(3500)),
  command("crypto", "Look up a cryptocurrency price.")
    .addStringOption((o) => o.setName("coin").setDescription("Coin ID, e.g. bitcoin, ethereum, solana").setRequired(true).setMaxLength(40))
    .addStringOption((o) => o.setName("currency").setDescription("Display currency").setRequired(false).addChoices(
      { name: "USD", value: "usd" }, { name: "EUR", value: "eur" }, { name: "GBP", value: "gbp" }
    )),
  command("github", "View a public GitHub profile.")
    .addStringOption((o) => o.setName("username").setDescription("GitHub username").setRequired(true).setMaxLength(39)),
  command("roblox", "Look up a Roblox profile.")
    .addStringOption((o) => o.setName("username").setDescription("Roblox username").setRequired(true).setMaxLength(20)),
  command("lastfm", "View a Last.fm user's recent listening.")
    .addStringOption((o) => o.setName("username").setDescription("Last.fm username").setRequired(true).setMaxLength(40)),
  command("spotify", "Search Spotify for a track, artist or album.")
    .addStringOption((o) => o.setName("query").setDescription("What should Breeze search for?").setRequired(true).setMaxLength(100)),
  command("fortnite", "Look up public Fortnite player stats.")
    .addStringOption((o) => o.setName("username").setDescription("Epic display name").setRequired(true).setMaxLength(32))
    .addStringOption((o) => o.setName("platform").setDescription("Platform").setRequired(true).addChoices(
      { name: "PC", value: "keyboard" }, { name: "PlayStation", value: "gamepad" }, { name: "Xbox", value: "gamepad" }
    )),
].map((item) => item.toJSON());

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "User-Agent": "BreezeDiscordBot/1.0", Accept: "application/json", ...options.headers },
    signal: AbortSignal.timeout(12000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason = data?.error?.message || data?.message || data?.detail || `Request failed (${response.status})`;
    throw new Error(String(reason).slice(0, 250));
  }
  return data;
}

async function askAI(prompt, mode = "answer") {
  if (!process.env.OPENAI_API_KEY) throw new Error("AI isn't configured yet. Add OPENAI_API_KEY to the bot environment.");
  const response = await api("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: mode === "summary"
          ? "Summarise the supplied text clearly and accurately. Use concise bullet points when useful."
          : "You are Breeze, a helpful, concise Discord assistant. Keep answers friendly, accurate and easy to understand." },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    }),
  });
  return response.choices?.[0]?.message?.content?.trim() || "I couldn't generate a response.";
}

async function getSpotifyToken() {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify search needs SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the bot environment.");
  }
  if (spotifyToken.value && Date.now() < spotifyToken.expiresAt) return spotifyToken.value;
  const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const response = await api("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  spotifyToken = { value: response.access_token, expiresAt: Date.now() + (response.expires_in - 60) * 1000 };
  return spotifyToken.value;
}
let spotifyToken = { value: null, expiresAt: 0 };

async function handleCommand(interaction) {
  const name = interaction.commandName;

  if (name === "ping") {
    await interaction.reply(`Pong! ${client.ws.ping}ms gateway latency.`);
    return;
  }
  if (name === "quote") {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(0x6d9cff).setDescription(`“${quote}”`).setFooter({ text: "Breeze • A little inspiration" })] });
    return;
  }
  if (name === "gif") {
    if (!process.env.TENOR_API_KEY) throw new Error("GIF search needs TENOR_API_KEY in the bot environment.");
    await interaction.deferReply();
    const params = new URLSearchParams({ q: interaction.options.getString("search", true), key: process.env.TENOR_API_KEY, client_key: "breeze-discord", limit: "1", media_filter: "gif" });
    const data = await api(`https://tenor.googleapis.com/v2/search?${params}`);
    const gif = data.results?.[0]?.media_formats?.gif?.url;
    await interaction.editReply(gif || "I couldn't find a GIF for that search.");
    return;
  }
  if (name === "ask" || name === "summarise") {
    await interaction.deferReply();
    const prompt = interaction.options.getString(name === "ask" ? "question" : "text", true);
    const result = await askAI(prompt, name === "summarise" ? "summary" : "answer");
    await interaction.editReply(result.slice(0, 1900));
    return;
  }
  if (name === "crypto") {
    await interaction.deferReply();
    const coin = interaction.options.getString("coin", true).toLowerCase().trim();
    const currency = interaction.options.getString("currency") || "usd";
    const data = await api(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coin)}&vs_currencies=${currency}&include_24hr_change=true`);
    if (!data[coin] || data[coin][currency] == null) throw new Error("Coin not found. Try a CoinGecko ID such as bitcoin or ethereum.");
    const price = new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase(), maximumSignificantDigits: 8 }).format(data[coin][currency]);
    const change = data[coin][`${currency}_24h_change`];
    const embed = new EmbedBuilder().setColor(0x6d9cff).setTitle(`${coin.toUpperCase()} price`).addFields({ name: "Price", value: price, inline: true });
    if (Number.isFinite(change)) embed.addFields({ name: "24h change", value: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`, inline: true });
    embed.setFooter({ text: "Market data via CoinGecko • Informational only" });
    await interaction.editReply({ embeds: [embed] });
    return;
  }
  if (name === "github") {
    await interaction.deferReply();
    const username = interaction.options.getString("username", true);
    const user = await api(`https://api.github.com/users/${encodeURIComponent(username)}`);
    const embed = new EmbedBuilder().setColor(0x8ba9d8).setAuthor({ name: user.login, iconURL: user.avatar_url, url: user.html_url })
      .setDescription(user.bio || "No public bio set.")
      .addFields(
        { name: "Repositories", value: String(user.public_repos), inline: true },
        { name: "Followers", value: String(user.followers), inline: true },
        { name: "Following", value: String(user.following), inline: true },
      ).setThumbnail(user.avatar_url).setURL(user.html_url).setFooter({ text: user.location ? user.location : "GitHub profile" });
    await interaction.editReply({ embeds: [embed] });
    return;
  }
  if (name === "roblox") {
    await interaction.deferReply();
    const username = interaction.options.getString("username", true);
    const result = await api("https://users.roblox.com/v1/usernames/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
    });
    const user = result.data?.[0];
    if (!user) throw new Error("I couldn't find that Roblox username.");
    const [details, avatar] = await Promise.all([
      api(`https://users.roblox.com/v1/users/${user.id}`),
      api(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=true`),
    ]);
    const embed = new EmbedBuilder().setColor(0x6d9cff).setTitle(details.displayName || user.name)
      .setURL(`https://www.roblox.com/users/${user.id}/profile`)
      .setDescription(details.description || "No public description.")
      .addFields({ name: "Username", value: `@${user.name}`, inline: true }, { name: "User ID", value: String(user.id), inline: true })
      .setFooter({ text: `Joined ${new Date(details.created).toLocaleDateString("en-US")}` });
    const image = avatar.data?.[0]?.imageUrl;
    if (image) embed.setThumbnail(image);
    await interaction.editReply({ embeds: [embed] });
    return;
  }
  if (name === "lastfm") {
    if (!process.env.LASTFM_API_KEY) throw new Error("Last.fm needs LASTFM_API_KEY in the bot environment.");
    await interaction.deferReply();
    const username = interaction.options.getString("username", true);
    const params = new URLSearchParams({ method: "user.getrecenttracks", user: username, api_key: process.env.LASTFM_API_KEY, format: "json", limit: "1" });
    const data = await api(`https://ws.audioscrobbler.com/2.0/?${params}`);
    const track = data.recenttracks?.track?.[0];
    if (!track) throw new Error("No recent tracks found for that Last.fm user.");
    const artist = track.artist?.["#text"] || "Unknown artist";
    const title = track.name || "Unknown track";
    const album = track.album?.["#text"];
    const embed = new EmbedBuilder().setColor(0xd65b38).setTitle(title).setDescription(`**${artist}**${album ? `\n${album}` : ""}`)
      .setURL(track.url).setFooter({ text: `Recent track • Last.fm user: ${username}` });
    const cover = track.image?.find((item) => item.size === "extralarge")?.["#text"];
    if (cover) embed.setThumbnail(cover);
    await interaction.editReply({ embeds: [embed] });
    return;
  }
  if (name === "spotify") {
    await interaction.deferReply();
    const token = await getSpotifyToken();
    const query = interaction.options.getString("query", true);
    const params = new URLSearchParams({ q: query, type: "track,artist,album", limit: "5" });
    const data = await api(`https://api.spotify.com/v1/search?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const track = data.tracks?.items?.[0];
    const artist = data.artists?.items?.[0];
    const album = data.albums?.items?.[0];
    const chosen = track || artist || album;
    if (!chosen) throw new Error("No Spotify results found.");
    const type = track ? "Track" : artist ? "Artist" : "Album";
    const subtitle = track ? `by ${track.artists.map((item) => item.name).join(", ")}` : (artist?.name || album?.artists?.map((item) => item.name).join(", ") || "");
    const image = chosen.album?.images?.[0]?.url || chosen.images?.[0]?.url;
    const embed = new EmbedBuilder().setColor(0x1db954).setTitle(chosen.name).setURL(chosen.external_urls.spotify)
      .setDescription(`**${type}** ${subtitle}`).setFooter({ text: "Spotify search" });
    if (image) embed.setThumbnail(image);
    await interaction.editReply({ embeds: [embed] });
    return;
  }
  if (name === "fortnite") {
    if (!process.env.FORTNITE_API_KEY) throw new Error("Fortnite stats need FORTNITE_API_KEY in the bot environment.");
    await interaction.deferReply();
    const username = interaction.options.getString("username", true);
    const platform = interaction.options.getString("platform", true);
    const data = await api(`https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(username)}&accountType=epic`, {
      headers: { Authorization: process.env.FORTNITE_API_KEY },
    });
    const stats = data.data?.stats?.all?.overall;
    if (!stats) throw new Error("No public Fortnite stats were returned for that player.");
    const embed = new EmbedBuilder().setColor(0x8b9cff).setTitle(data.data.account?.name || username)
      .addFields(
        { name: "Wins", value: String(stats.wins ?? 0), inline: true },
        { name: "Matches", value: String(stats.matches ?? 0), inline: true },
        { name: "Win rate", value: `${Number(stats.winRate || 0).toFixed(1)}%`, inline: true },
        { name: "K/D", value: Number(stats.kd || 0).toFixed(2), inline: true },
        { name: "Kills", value: String(stats.kills ?? 0), inline: true },
      ).setFooter({ text: `Fortnite stats • Requested platform: ${platform === "keyboard" ? "PC" : "Console"}` });
    await interaction.editReply({ embeds: [embed] });
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Breeze is online as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  try {
    await handleCommand(interaction);
  } catch (error) {
    console.error(`/${interaction.commandName} failed:`, error);
    const message = error.message || "Something went wrong. Please try again.";
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: message.slice(0, 1900), embeds: [] }).catch(() => {});
    } else {
      await interaction.reply({ content: message.slice(0, 1900), ephemeral: true }).catch(() => {});
    }
  }
});

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "32kb" }));
const allowedOrigins = (process.env.DASHBOARD_ORIGIN || "").split(",").map((value) => value.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));
app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "breeze-bot",
    discord: client.isReady() ? "connected" : "connecting",
    uptime: Math.floor(process.uptime()),
    commands: commands.map((item) => item.name),
  });
});

const port = Number(process.env.PORT || 3001);
const server = app.listen(port, "0.0.0.0", () => console.log(`Breeze health API listening on port ${port}`));

async function start() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
  const route = process.env.DISCORD_GUILD_ID
    ? Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID)
    : Routes.applicationCommands(process.env.DISCORD_CLIENT_ID);
  await rest.put(route, { body: commands });
  console.log(`Registered ${commands.length} Breeze slash commands.`);
  await client.login(process.env.DISCORD_BOT_TOKEN);
}

start().catch((error) => {
  console.error("Breeze failed to start:", error);
  process.exit(1);
});

function shutdown() {
  server.close();
  client.destroy();
  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
