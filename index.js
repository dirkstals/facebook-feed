
var debug = process.argv[process.argv.length - 1] == 'debug';

var distFolder = debug ? '/src' : '/dist';

var express = require('express');
var app = express();
var router = express.Router();

var facebookService = require('./src/assets/js/facebookService');

var port = 3030;

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

app.use('/api', router);


// WEBSERVER
app.use(express.static(__dirname));
app.use(express.static(__dirname + distFolder));

app.get('/', function(req, res){

    res.sendFile(__dirname + distFolder + '/index.html');
});

var server = app.listen(port, function(){
    
    console.log('listening on *:' + port);
});


// SOCKET.IO
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    
    console.log('New client connected!');

    socket.emit('data', {
        data: "This is my data"
    });
});