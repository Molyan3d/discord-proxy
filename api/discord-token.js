// api/discord-token.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, client_id, redirect_uri } = req.body;
  const client_secret = process.env.CLIENT_SECRET; // Legge il client_secret da Vercel env vars

  if (!code || !client_id || !redirect_uri) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("client_secret", client_secret);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("scope", "identify");

    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const data = await response.json();

    // Passa la risposta al server Altervista
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
