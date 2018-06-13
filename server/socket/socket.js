var socket = require('socket.io');
var filesystem = require('../filesystem/chat.storage');
var http = require('http');
var mongoapi = require('../routes/mongodb/mongo.api.functions');
//Socket setup
module.exports = function (server) {
    var socket_io = socket(server);
    var users = {};
    var ips = {};
    var socket_set = {};
    socket_io.on('connection', function (socket) {

        // console.log('new socket connection made at : ' + socket.handshake.address);

        //checking device
        socket.on('prelogin', function (data) {
            mongoapi.geteDeviceIps(data, function (res) {
                dev_data = res;
                if (dev_data.device_ips.includes(socket.handshake.address) || dev_data.device_ips.length < 3) {
                    socket.emit('allowlogin');
                }
                else {
                    socket.emit('logdeviceout', dev_data.device_ips);
                }
            });
        });

        //creating online usere
        socket.on('login', function (data) {

            users[socket.id] = data;

            mongoapi.geteDeviceIps(data, function (res) {
                let data = res;
                if (!data.device_ips.includes(socket.handshake.address)) {
                    data.device_ips.push(socket.handshake.address);
                    mongoapi.updateDeviceIps(data.handle, data.device_ips);
                }
            });

            if (ips[data] !== undefined && ips[data] !== socket.handshake.address) {
                // console.log('same user logged in from two different systems');
                socket_set[data].forEach(element => {
                    if (socket_io.sockets.connected[element] !== undefined) {
                        socket_io.sockets.connected[element].emit('logmeout');
                    }
                }, socket_set[data] = undefined);
            }

            ips[data] = socket.handshake.address;

            if (socket_set[data] === undefined) {
                socket_set[data] = [socket.id];
            }
            else {
                socket_set[data].push(socket.id)
            }

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
