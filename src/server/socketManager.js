const io = require('./server.js').io

module.exports = (socket) => {
    console.log(`Socket ID: ${socket.id}`)
};