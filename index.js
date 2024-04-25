const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

// Listen for new Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');
    broadcastData();

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        broadcastData()
    });

    socket.on('data', (data) => {
        socket.data.name = data;
        console.log("Received name change from " + socket.data.name);
        broadcastData()
    })

});

function broadcastData(){
    const allSockets = Array.from(io.sockets.sockets.values());

    let data = []

    allSockets.forEach((socket) => {
        data.push({
            name: socket.data.name || ""
        })
    });

    io.emit('data', data);
}

// Start the server
const PORT = process.env.PORT || 3005;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});