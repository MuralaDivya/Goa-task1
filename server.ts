import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

interface ShareItem {
  id: string;
  dataUrl: string; // Base64 PNG image
  name?: string;
  title?: string;
  stack?: string;
  format: "pfp" | "builder";
  createdAt: number;
}

// Memory store for generated shares (max 1000 items)
const shareStore = new Map<string, ShareItem>();

function cleanOldShares() {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  for (const [id, item] of shareStore.entries()) {
    if (now - item.createdAt > ONE_WEEK) {
      shareStore.delete(id);
    }
  }
}

const app = express();
app.set("trust proxy", 1);

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "25mb" }));

// API: Save generated graphic for sharing
app.post("/api/share", (req, res) => {
  try {
    cleanOldShares();
    const { dataUrl, name, title, stack, format } = req.body;
    if (!dataUrl || typeof dataUrl !== "string") {
      return res.status(400).json({ error: "Invalid image data" });
    }

    // Generate clean short ID
    const randomHex = Math.random().toString(36).substring(2, 8);
    const sanitizedName = (name || "builder")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 12);
    const id = `${sanitizedName ? sanitizedName + "-" : ""}${randomHex}`;

    const item: ShareItem = {
      id,
      dataUrl,
      name: name || "Builder",
      title: title || "HH Goa 2026 Participant",
      stack: stack || "Tech Enthusiast",
      format: format === "pfp" ? "pfp" : "builder",
      createdAt: Date.now(),
    };

    shareStore.set(id, item);

    const host = req.get("host") || "localhost:3000";
    const protocol = req.protocol || "https";
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const shareUrl = `${baseUrl}/share/${id}`;
    const imageUrl = `${baseUrl}/api/image/${id}`;

    return res.json({ id, shareUrl, imageUrl });
  } catch (err) {
    console.error("Error saving share:", err);
    return res.status(500).json({ error: "Failed to create share link" });
  }
});

// API: Get binary image by ID
app.get("/api/image/:id", (req, res) => {
  const { id } = req.params;
  const item = shareStore.get(id);

  if (!item) {
    return res.status(404).send("Image not found");
  }

  try {
    // Convert Base64 data URL to buffer
    const base64Data = item.dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, "base64");

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": imgBuffer.length,
      "Cache-Control": "public, max-age=604800, immutable",
    });
    res.end(imgBuffer);
  } catch (err) {
    console.error("Error serving image:", err);
    res.status(500).send("Error serving image");
  }
});

// API: Get share metadata
app.get("/api/share-data/:id", (req, res) => {
  const { id } = req.params;
  const item = shareStore.get(id);

  if (!item) {
    return res.status(404).json({ error: "Share item not found" });
  }

  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "https";
  const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

  res.json({
    id: item.id,
    name: item.name,
    title: item.title,
    stack: item.stack,
    format: item.format,
    imageUrl: `${baseUrl}/api/image/${item.id}`,
    dataUrl: item.dataUrl,
    createdAt: item.createdAt,
  });
});

// Helper to check if user agent is a social crawler/bot
function isSocialBot(userAgent: string): boolean {
  if (!userAgent) return false;
  const bots = [
    "twitterbot",
    "facebookexternalhit",
    "linkedinbot",
    "whatsapp",
    "telegrambot",
    "discordbot",
    "slackbot",
    "googlebot",
    "bingbot",
    "crawler",
    "parser",
  ];
  const ua = userAgent.toLowerCase();
  return bots.some((b) => ua.includes(b));
}

// Social Share Bot meta tag interceptor for /share/:id
app.get("/share/:id", (req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  const { id } = req.params;
  const item = shareStore.get(id);

  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "https";
  const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
  const sharePageUrl = `${baseUrl}/share/${id}`;
  const imageUrl = item ? `${baseUrl}/api/image/${id}` : `${baseUrl}/og-default.png`;

  const title = item
    ? `${item.name} | ${item.title} — HH Goa 2026`
    : "HH Goa 2026 — Frame In Goa";
  const description = item
    ? `Framed my builder era at HH Goa 2026 🌴⚡ #FrameInGoa`
    : "Turn your photo into a builder badge or PFP frame for HH Goa 2026!";

  // If request comes from social crawler, return meta tags HTML response directly
  if (isSocialBot(userAgent)) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="${item?.format === "pfp" ? "1080" : "1080"}" />
  <meta property="og:image:height" content="${item?.format === "pfp" ? "1080" : "1350"}" />
  <meta property="og:url" content="${sharePageUrl}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${imageUrl}" alt="${title}" />
</body>
</html>`;
    return res.status(200).send(html);
  }

  // Otherwise, pass to SPA handler
  next();
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
