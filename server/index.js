// server.js
const WebSocket = require('ws');

const port = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port });

console.log(`WebSocket server listening on ws://0.0.0.0:${port}`);

// 我们只做简单转发：广播收到的二进制给所有其它客户端
wss.on('connection', ws => {
    console.log('client connected. total:', wss.clients.size);

    ws.on('message', (data, isBinary) => {
        // 直接广播二进制数据（避免回送给发送者）
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });

    ws.on('close', () => {
        console.log('client disconnected. total:', wss.clients.size);
    });
});
