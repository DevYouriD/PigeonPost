const express = require('express');
const app = express();

// Discord webhook for notifications
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1507327352856907867/NiCVXQz_Wk-3f7569QPt2x06zFsebYvd-yUSvd0VO7Hg79LM9EYvqXxtEO8TcNrXRp-v";

app.use(express.json());

// Static dashboard (disabled for now)
// app.use(express.static('public'));

// Map to store currently online players
const online = new Map();

// Returns list of currently online players
app.get('/online', (req, res) => {
    const players = Array.from(online.keys());
    res.json({
        count: players.length,
        players
    });
});

// Health/status endpoint
app.get('/status', (req, res) => {
    res.json({
        online: online.size,
        uptime: process.uptime()
    });
});

// Receive events from Minecraft Paper Server plugin
app.post('/event', (req, res) => {
    const { type, player, time } = req.body;

    // Player joins
    if (type === 'join') {
        online.set(player, time);
        console.log(`🟢 ${player} joined`);
        notifyDiscord(`🟢 ${player} joined: <t:${Math.floor(time / 1000)}:F>`);
    }

    // Player leaves
    if (type === 'leave') {
        const joinTime = online.get(player);
        online.delete(player);

        if (joinTime) {
            const sessionMs = time - joinTime;
            console.log(`🔴 ${player} left`);
            notifyDiscord(`🔴 ${player} left: <t:${Math.floor(time / 1000)}:F> • Session ${formatSession(sessionMs)}`);
        }
    }

    // Log raw event
    console.log("📩 EVENT:", req.body);
    res.json({ ok: true });
});

// Send message to Discord webhook
async function notifyDiscord(message) {
    try {
        await fetch(DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: message })
        });
    } catch (e) {
        console.log("Discord error:", e.message);
    }
}

// Format session duration
function formatSession(ms) {
    const seconds = Math.floor(ms / 1000);

    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
}

// Start server
app.listen(3000, '0.0.0.0', () => {
    console.log("PigeonPost listening on 3000");
});