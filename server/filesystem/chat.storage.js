const fs = require('fs');
const path = 'server/filesystem/chats/';
var FileSystemMW = {

    //Store Messages
    storeChat: function (data) {

        fs.appendFile(path + data.sender + data.receiver + '.txt', JSON.stringify(data) + ",\n", { encoding: 'utf-8' }, function (err) {
            if (err) {
                console.log('chat storage failure. sender: ' + data.sender + ', receiver: ' + data.receiver);
            }
            else {
                console.log('chat stored. sender: ' + data.sender + ', receiver: ' + data.receiver);
            }
        });

        fs.appendFile(path + data.receiver + data.sender + '.txt', JSON.stringify(data) + ",\n", { encoding: 'utf-8' }, function (err) {
            if (err) {
                console.log('chat storage failure. receiver: ' + data.receiver + ', sender: ' + data.sender);
            }
            else {
                console.log('chat stored. receiver: ' + data.receiver + ', sender: ' + data.sender);
            }
        });
    },

    deleteChat: function (data, callback) {
        fs.unlink(path + data.sender + data.receiver + '.txt', function (err) {
            if (err) {
                console.log('chat deletion error, sender: ' + data.sender);
                callback();
            }
            else {
                console.log('chat deletd: ' + data.sender + data.receiver + '.txt');
                callback();
            }
        });
    }
}

module.exports = FileSystemMW;
