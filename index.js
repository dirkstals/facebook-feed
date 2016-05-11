
var distFolder = '/dist';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

var facebookService = require('./src/assets/js/facebookService');

var port = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// API
router.get('/', function(req, res){

    res.json({ message: 'hooray! welcome to our api!' }); 
});

router.get('/users', function(req, res){

    facebookService.getEventUsers(process.env.EVENTID, function(data){
        res.json(data);    
    });
});

router.get('/photos', function(req, res){

    facebookService.getEventPhotos(process.env.EVENTID, function(data){
        res.json(data);    
    });
});

router.get('/feed', function(req, res){

    facebookService.getEventFeed(process.env.EVENTID, function(data){
        res.json(data);    
    });
});

app.use('/api', router);


// WEBSERVER
app.use(express.static(__dirname));
app.use(express.static(__dirname + distFolder));

app.get('/', function(req, res){

    res.sendFile(__dirname + distFolder + '/index.html');
});

app.get('/webhook', function (req, res) {

    if (req.query['hub.verify_token'] === 'you_got_some_new_posts') {

        res.send(req.query['hub.challenge']);
    } else {
        
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
    
    facebookService.getEventFeedSince(process.env.EVENTID, function(data){

        if(data && data.data && data.data.length > 0){

            io.emit('data', data);
        }else{

            console.log('nothing\'s changed.');
        }
    });

    res.sendStatus(200);
});


var server = app.listen(port, function(){
    
    console.log('listening on *:' + port);
});


// SOCKET.IO
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    
    console.log('New client connected!');
});