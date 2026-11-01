const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const http = require('http');

const client = new Client({ checkUpdate: false });
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('WINDS Bot Status: 24/7 Active & Running');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

setInterval(() => {
  http.get(`http://localhost:${PORT}`, (res) => {}).on('error', (err) => {
    console.error('Keep-alive ping error:', err.message);
  });
}, 5 * 60 * 1000);

client.on('ready', async () => {
  console.log(`[+] Logged in successfully as ${client.user.tag}!`);

  let isLiveIndia = true; // State tracker for the rotation cycle

  const updateStatus = () => {
    if (isLiveIndia) {
      // 1st Status: Playing LIVE-India (1 Hour block)
      client.user.setPresence({
        status: 'online',
        activities: [{
          name: 'LIVE-INDIA',
          type: 'PLAYING',
          details: 'Developing Open-World Game',
          state: 'Unity Engine',
        }]
      });
      console.log('[+] Status switched to: LIVE-INDIA');
    } else {
      // 2nd Status: Unity Exact Status (5 Hours block)
      client.user.setPresence({
        status: 'online',
        activities: [{
          name: 'Unity',
          type: 'PLAYING',
          details: 'Editing LIVE-INDIA Scene',
          state: 'Project Open',
          application_id: '1566412255757865032',
          assets: {
            largeImage: '1000325844',
            largeText: 'Unity 2022.3.2f1'
          }
        }]
      });
      console.log('[+] Status switched to: Unity (Exact)');
    }
  };

  // Run immediately on start
  updateStatus();

  // Set interval loop: Switch every 1 hour (1 Hour = 3600000 ms)
  // Note: To make it strict: 1 hr for LIVE-INDIA, then switch. But since the next is 5 hrs, 
  // we toggle the timer dynamically or use a dual-timeout loop for exact 1h and 5h durations.
  
  const runCycle = async () => {
    // 1 Hour duration for LIVE-INDIA
    setTimeout(async () => {
      isLiveIndia = false;
      updateStatus();

      // 5 Hours duration for Unity status (5 * 60 * 60 * 1000 ms)
      setTimeout(async () => {
        isLiveIndia = true;
        updateStatus();
        runCycle(); // Repeat the whole cycle infinitely
      }, 5 * 60 * 60 * 1000);

    }, 1 * 60 * 60 * 1000);
  };

  runCycle();
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  process.exit(1);
}

client.login(token);
