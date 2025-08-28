const fs = require("fs");
const https = require("https");
const WebSocket = require("ws");
const express = require("express");

const app = express();

app.use(express.static("public"));

const server = https.createServer({
    key: fs.readFileSync("certs/server.key"),
    cert: fs.readFileSync("certs/server.crt"),
}, app);

// WebSocket 绑定到 HTTPS server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        const message = JSON.parse(data);
        console.log(message)
        console.log('Received:', message.type);

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

server.listen(443, "0.0.0.0", () => {
    console.log("🚀 HTTPS+WSS server running at https://localhost/");
});
