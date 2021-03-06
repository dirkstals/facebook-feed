
var express = require('express');
var bodyParser = require('body-parser');
var facebookService = require('./facebookService');
var socketio = require('socket.io');

var app = express();
var APIRouter = express.Router();
var distFolder = '/dist';
var port = process.env.PORT || 3030;
var server = app.listen(port, function(){

    console.log("\n\tWebserver started on port " + port + " ... \n");
});
var io = socketio(server);


var posts,
    users,
    heartbeatTimeout;


/**
 * @function _onUsersRoute
 * @private
 */
var _onUsersRoute = function(req, res){

    res.json(users);
};


/**
 * @function _onFeedRoute
 * @private
 */
var _onFeedRoute = function(req, res){
    
    if(posts){
        res.json(_shuffle(posts.slice(0)).slice(0, 13));
    }
};


/**
 * @function _onRoute
 * @private
 */
var _onRoute = function(req, res){

    res.sendFile(__dirname + distFolder + '/index.html');
};


/**
 * @function _onAdminRoute
 * @private
 */
var _onAdminRoute = function(req, res){

    res.sendFile(__dirname + distFolder + '/admin.html');
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

    clearTimeout(heartbeatTimeout);

    _heartbeat();

    res.sendStatus(200);
};



/**
 * @function _startUp
 * @private
 */
var _startUp = function(){

    facebookService.getGroupUsers(process.env.EVENTID, function(data){

        users = data;

        data.data.map(function(user){
            users[user.id] = {
                name: user.name,
                picture: user.picture.data.url,
            }
        });


        facebookService.getGroupFeed(process.env.EVENTID, function(feedData){
            
            posts = [];

            _convertFeedToPosts(feedData);
        });
    });

    heartbeatTimeout = setTimeout(_heartbeat, 30 * 1000);
};


/**
 * @function _heartbeat
 * @private
 */
var _heartbeat = function(){

    facebookService.getGroupFeedSince(process.env.EVENTID, _handleGroupFeedSince);

    heartbeatTimeout = setTimeout(_heartbeat, 30 * 1000);
};


/**
 * @function _handleGroupFeedSince
 * @private
 */
var _handleGroupFeedSince = function(data){

    _convertFeedToPosts(data);
};




/**
 * @function _convertFeedToPosts
 * @private
 */
var _convertFeedToPosts = function(data){

    var newPosts = [];

    if(data && data.data){

        data.data.map(function(item){

            if(item.attachments && item.attachments.data && item.attachments.data.length > 0){

                item.attachments.data.map(function(attachment){

                    var post = {
                        id: attachment.target.id,
                        from: users[item.from.id].picture,
                        message: attachment.description || item.message || '' // attachment.title || 
                    };

                    if(item.comments && item.comments.data && item.comments.data.length > 0){

                        post.message = item.comments.data[0].message;
                        post.from = users[item.comments.data[0].from.id].picture;
                    }

                    if(attachment.subattachments && attachment.subattachments.data  && attachment.subattachments.data.length > 0){

                        attachment.subattachments.data.map(function(subattachment){
                            
                            if(subattachment.type && subattachment.type === 'photo'){
                            
                                newPosts.push(_addPost({
                                    id: subattachment.target.id,
                                    from: post.from,
                                    message: subattachment.description || post.message,
                                    src: subattachment.media.image.src
                                }));
                            }
                        });
                    }else{

                        post.src = attachment.media.image.src;

                        if(attachment.type && attachment.type === 'photo'){
                            
                            newPosts.push(_addPost(post));
                        }
                    }
                })                        
            }

        });
    }

    if(newPosts.length > 0){

        io.emit('data', newPosts);
    }
}


/**
 * @function _addPost
 * @private
 */
var _addPost = function(post){

    var itemIndex = posts.findIndex(function(item){ return item.id === post.id});

    if(itemIndex > -1){
        
        posts[itemIndex] = post;
    }else{

        posts.push(post);
    } 

    return post;
};


/**
 * @function _shuffle
 * @private
 */
function _shuffle(array) {

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


APIRouter.get('/users', _onUsersRoute);
APIRouter.get('/feed', _onFeedRoute);

app.use('/api', APIRouter);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(__dirname + distFolder));

app.get('/', _onRoute);
app.get('/admin', _onAdminRoute);
app.get('/webhook', _onWebhookRoute);
app.post('/webhook', _onWebhookRoutePost);

io.on('connection', function(socket) {
    
    socket.on('refresh', function(){
        io.emit('refresh');
    });

    socket.on('restart', function(){
        process.exit();
    });
});

_startUp();
