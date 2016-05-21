
var express = require('express');
var bodyParser = require('body-parser');
var facebookService = require('./src/assets/js/facebookService');
var socketio = require('socket.io');

var app = express();
var APIRouter = express.Router();
var distFolder = '/dist';
var port = process.env.PORT || 3030;
var server = app.listen(port, function(){

    console.log("\n\tWebserver started on port " + port + " ... \n");
});
var io = socketio(server);



/**
 * @function _handleGroupFeedSince
 * @private
 */
var _handleGroupFeedSince = function(data){

    if(data && data.data && data.data.length > 0){

        io.emit('data', data);
    }else{

        console.log('nothing\'s changed.');
    }
};


/**
 * @function _onUserRoute
 * @private
 */
var _onUserRoute = function(req, res){
    facebookService.getUser(req.params.userid, function(data){
        res.json(data);    
    });
};


/**
 * @function _onPhotoRoute
 * @private
 */
var _onPhotoRoute = function(req, res){

    facebookService.getPhoto(req.params.photoid, function(data){
        res.json(data);    
    });
};


/**
 * @function _onUsersRoute
 * @private
 */
var _onUsersRoute = function(req, res){

    facebookService.getGroupUsers(process.env.EVENTID, function(data){
        res.json(data);    
    });
};


/**
 * @function _onFeedRoute
 * @private
 */
var _onFeedRoute = function(req, res){

    facebookService.getGroupFeed(process.env.EVENTID, function(data){
        res.json(data);    
    });
};


/**
 * @function _onRoute
 * @private
 */
var _onRoute = function(req, res){

    res.sendFile(__dirname + distFolder + '/index.html');
};


/**
 * @function _onWebhookRoute
 * @private
 */
var _onWebhookRoute = function (req, res) {
    
    console.log("FACEBOOK WEBHOOK Authorization");
    
    if (req.query['hub.verify_token'] === 'you_got_some_new_posts') {

        res.send(req.query['hub.challenge']);
    } else {
        
        res.send('Invalid verify token');
    }
};


/**
 * @function _onWebhookRoutePost
 * @private
 */
var _onWebhookRoutePost = function (req, res) {

    console.log("FACEBOOK WEBHOOK");

    facebookService.getGroupFeedSince(process.env.EVENTID, _handleGroupFeedSince);

    res.sendStatus(200);
};




APIRouter.get('/user/:userid', _onUserRoute);
APIRouter.get('/photo/:photoid', _onPhotoRoute);
APIRouter.get('/users', _onUsersRoute);
APIRouter.get('/feed', _onFeedRoute);

app.use('/api', APIRouter);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(__dirname + distFolder));

app.get('/', _onRoute);
app.get('/webhook', _onWebhookRoute);
app.post('/webhook', _onWebhookRoutePost);


