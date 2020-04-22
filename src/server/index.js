const app = require('express')();
const http = require('http').createServer(app);
const io = module.exports.io = require('socket.io')(http);
const socketManager = require('./socketManager');
const port = 3001;

io.on('connection', socketManager);

http.listen(port, () => {
    console.log(`Listening on port ${port}`)
});