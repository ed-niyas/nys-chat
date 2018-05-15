var express= require('express');
var bodyParser = require('body-parser');
var path = require('path');
var socket= require('socket.io');
var mongodb = require('./server/routes/mongodb/mongo.api');
var filesystem= require('./server/filesystem/chat.storage');

app= express();

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/nys-chat')));

//mongo api
app.use('/mongodb', mongodb);
app.use('/chatfiles',express.static(path.join(__dirname,'server/filesystem/chats')));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/nys-chat/index.html'));
});

//setting port and starting server
const port = process.env.PORT || '3000';
var server = app.listen(port,  () =>{ console.log(`Running on localhost:${port}`)});

//Socket setup
var socket_io= socket(server);

socket_io.on('connection', function(socket){
    console.log('new socket connection made');
     // Handle chat event
    socket.on('chat', function(data){
    socket_io.sockets.emit('chat', data);
    filesystem.storeChat(data);
    });
});