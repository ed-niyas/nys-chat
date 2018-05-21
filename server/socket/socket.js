var socket = require('socket.io');
var filesystem = require('../filesystem/chat.storage');

//Socket setup
module.exports = function(server){
    var socket_io = socket(server);
    var users = {};
    socket_io.on('connection', function (socket) {
        console.log('new socket connection made');

        //creating online usere
        socket.on('login', function (data) {
            users[socket.id] = data;
            socket_io.sockets.emit('online', Object.values(users));
        });

        // Handle chat event
        socket.on('chat', function (data) {
            socket_io.sockets.emit('chat', data);
            filesystem.storeChat(data);
        });
        //Handle type event
        socket.on('typing', function (data) {
            socket_io.sockets.emit('typing', data);
        });
        //Handle delete chat event
        socket.on('deletechat', function (data) {
            filesystem.deleteChat(data, function () {
                socket_io.emit('chatDeleted', data);
            });
        });

        //removing online user
        socket.on('disconnect', function () {
            delete users[socket.id];
            socket_io.sockets.emit('online', Object.values(users));
        });

        //removing online user
        socket.on('logout', function () {
            delete users[socket.id];
            socket_io.sockets.emit('online', Object.values(users));
        });
    });
}
