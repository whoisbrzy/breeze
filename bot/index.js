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
} from "discord.js";

const required = ["DISCORD_BOT_TOKEN", "DISCORD_CLIENT_ID"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder().setName("quote").setDescription("Get a little boost of inspiration."),
  new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Search for a GIF.")
    .addStringOption((option) =>
      option.setName("search").setDescription("What should the GIF show?").setRequired(true).setMaxLength(80)
    ),
  new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask Breeze AI a question.")
    .addStringOption((option) =>
      option.setName("question").setDescription("Your question").setRequired(true).setMaxLength(1500)
    ),
  new SlashCommandBuilder()
    .setName("summarise")
    .setDescription("Summarise a piece of text.")
    .addStringOption((option) =>
      option.setName("text").setDescription("Text to summarise").setRequired(true).setMaxLength(3500)
    ),
].map((command) => command.toJSON());

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
  const route = process.env.DISCORD_GUILD_ID
    ? Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID)
    : Routes.applicationCommands(process.env.DISCORD_CLIENT_ID);
  await rest.put(route, { body: commands });
  console.log(`Registered ${commands.length} Breeze slash commands.`);
}

async function askAI(prompt, mode = "answer") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("AI is not configured yet. Add OPENAI_API_KEY in the server environment.");
  }
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: mode === "summary"
            ? "Summarise the supplied text clearly and accurately. Use concise bullet points when useful."
            : "You are Breeze, a helpful and concise Discord assistant. Keep answers friendly and easy to understand.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "The AI service returned an error.");
  return data.choices?.[0]?.message?.content?.trim() || "I couldn't generate a response.";
}

const quotes = [
  "Small progress is still progress.",
  "Make it simple, but make it meaningful.",
  "Great things are built one step at a time.",
  "Consistency turns plans into results.",
  "Start where you are. Build from there.",
];

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Breeze is online as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === "quote") {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      await interaction.reply({ content: `“${quote}”\n— Breeze` });
      return;
    }

    if (interaction.commandName === "gif") {
      const search = interaction.options.getString("search", true);
      if (!process.env.TENOR_API_KEY) {
        await interaction.reply({ content: "GIF search isn't configured yet. Add TENOR_API_KEY to the bot environment.", ephemeral: true });
        return;
      }
      await interaction.deferReply();
      const params = new URLSearchParams({
        q: search,
        key: process.env.TENOR_API_KEY,
        client_key: "breeze-discord",
        limit: "1",
        media_filter: "gif",
      });
      const response = await fetch(`https://tenor.googleapis.com/v2/search?${params}`);
      const data = await response.json();
      const gif = data.results?.[0]?.media_formats?.gif?.url;
      await interaction.editReply(gif || "I couldn't find a GIF for that search.");
      return;
    }

    if (interaction.commandName === "ask") {
      await interaction.deferReply();
      const answer = await askAI(interaction.options.getString("question", true));
      await interaction.editReply(answer.slice(0, 1900));
      return;
    }

    if (interaction.commandName === "summarise") {
      await interaction.deferReply();
      const summary = await askAI(interaction.options.getString("text", true), "summary");
      await interaction.editReply(summary.slice(0, 1900));
    }
  } catch (error) {
    console.error("Interaction error:", error);
    const message = error.message || "Something went wrong. Please try again.";
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(message.slice(0, 1900)).catch(() => {});
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
  });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, "0.0.0.0", () => console.log(`Breeze health API listening on port ${port}`));

async function start() {
  await registerCommands();
  await client.login(process.env.DISCORD_BOT_TOKEN);
}

start().catch((error) => {
  console.error("Breeze failed to start:", error);
  process.exit(1);
});

process.on("SIGTERM", () => {
  client.destroy();
  process.exit(0);
});
process.on("SIGINT", () => {
  client.destroy();
  process.exit(0);
});
