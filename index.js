const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const http = require('http');

const client = new Client({ checkUpdate: false });
const app = express();
const PORT = process.env.PORT || 3000;

// Render Web Service ko active rakhne ke liye server root
app.get('/', (req, res) => {
  res.send('WINDS Bot Status: 24/7 Active & Running');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

// Self-ping keep-alive mechanism taaki bot 24/7 online rahe
setInterval(() => {
  http.get(`http://localhost:${PORT}`, (res) => {
    // Ping successful
  }).on('error', (err) => {
    console.error('Keep-alive ping error:', err.message);
  });
}, 5 * 60 * 1000); // Har 5 minute mein ping karega

client.on('ready', async () => {
  console.log(`[+] Logged in successfully as ${client.user.tag}!`);
  
  // Custom Playing Status
  client.user.setPresence({
    status: 'online',
    activities: [{
      name: 'Live-India',
      type: 'PLAYING'
    }]
  });
  console.log('[+] Status set to: Playing Live-India');
});

// Render Environment Variable se token uthayega
const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error("[-] Error: DISCORD_TOKEN environment variable is missing!");
  process.exit(1);
}

client.login(token);
