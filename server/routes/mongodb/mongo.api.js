const express = require('express');
const router = express.Router();
var ApiFunctions = require('./mongo.api.functions');

// middleware that is specific to this router
router.use(function Log (req, res, next) {
    console.log('Mongo Api called ('+req.method+') : '+ req.originalUrl);
    next()
});

//Empty Requests
router.route('/')
.get(function (req, res) {
    res.send('Mongo Apis GET are working!')
})
.post(function (req, res) {
    res.send('Mongo Apis POST are working!')
})
.put(function (req, res) {
    res.send('Mongo Apis PUT are working!')
})
.delete(function (req, res) {
    res.send('Mongo Apis DELETE are working!')
});

//Main
router.route('/:CollectionName')
.get(function (req, res) {
    ApiFunctions.GET_CALL(req, res, function(result) {
        res.header('Access-Control-Allow-Origin', '*');
        res.json(result);
     }); 
})
.post(function (req, res) {
    ApiFunctions.POST_CALL(req, res, function(result) {
        res.header('Access-Control-Allow-Origin', '*');
        res.json(result);
    }); 
})
.put(function (req, res) {
    ApiFunctions.PUT_CALL(req, res, function(result) {
        res.header('Access-Control-Allow-Origin', '*');
        res.json(result);
    }); 
})
.delete(function (req, res) {
    ApiFunctions.DELETE_CALL(req, res, function(result) {
        res.header('Access-Control-Allow-Origin', '*');
        res.json(result);
    }); 
});

//Always Should be Last
router.route('*')
.get(function (req, res) {
    res.send('Sorry, we cannot find that!')
})
.post(function (req, res) {
    res.send('Sorry, we cannot find that!')
})
.put(function (req, res) {
    res.send('Sorry, we cannot find that!')
})
.delete(function (req, res) {
    res.send('Sorry, we cannot find that!')
});

module.exports = router
