var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongodb = require('./server/routes/mongodb/mongo.api');
var cors = require('cors');
var socketFn = require('./server/socket/socket');

app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/nys-chat')));

//mongo api
app.use('/mongodb', mongodb);
app.use('/chatfiles', express.static(path.join(__dirname, 'server/filesystem/chats')));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/nys-chat/index.html'));
});

//setting port and starting server
const port = process.env.PORT || '3000';
var server = app.listen(port, () => { console.log(`Running on localhost:${port}`) });

//Socket setup
socketFn(server);