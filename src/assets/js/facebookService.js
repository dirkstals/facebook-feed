var https = require('https');

var facebookService = (function(){

    var _options = {
            host: 'graph.facebook.com'
        },
        lastTimeChecked,
        storedPosts = [];


    /**
     * @function _get
     * @private
     */
    var _get = function(path, callback, parameters){

        parameters = parameters || [];
        parameters.push({'access_token': process.env.USERTOKEN});

        var serializedParameters = parameters.map(function(item){

            return Object.keys(item)[0] + '=' + item[Object.keys(item)[0]];
        }).join('&');

        _options.path = path + '?' + serializedParameters;

        https.get(_options, function(res){
            var data = '';

            res.on('data', function (chunk) {
                
                data += chunk;
            });

            res.on('end', function() {

                if(res.headers['content-type'].indexOf('javascript') !== -1){
                    data = JSON.parse(data);
                }

                callback(data);
            });
        });
    }
    

    /**
     * @function getEventPhotos
     * @public
     */
    var getEventPhotos = function(eventId, callback){

        _get('/' + eventId + '/photos', function(data){

            var photoIds = data.data.map(function(item){return item.id;});

            _get('/', callback, [{'ids': photoIds.join(',')}, {'fields': 'images,from'}]);
        });
    };


    /**
     * @function getEventUsers
     * @public
     */
    var getUser = function(userId, callback){

        _get('/' + userId, callback, [{'fields': 'picture,name'}, {'type': 'large'}]);
    };


    /**
     * @function getEventUsers
     * @public
     */
    var getEventUsers = function(eventId, callback){

        _get('/' + eventId, function(data){

            var attendingUserIds = data.attending ? data.attending.data.map(function(item){return item.id;}) : [];
            var noreplyUserIds = data.noreply ? data.noreply.data.map(function(item){return item.id;}) : [];
            var userIds = attendingUserIds.join(',') + ',' + noreplyUserIds.join(',');

            _get('/', callback, [{'ids': userIds}, {'fields': 'picture,name'}, {'type': 'large'}]);

        }, [{'fields': 'attending,noreply'}]);
    };


    /**
     * @function getFeed
     * @public
     */
    var getFeed = function(eventID, callback, since){

        var params = [{'fields': 'id,message,likes.summary(1),type,object_id,from,updated_time'}];

        if(since){

            params.push({'since': since});
        }
        
        _get('/' + eventID + '/feed', function(data){

            if(data.data && data.data.length > 0 && data.data[0] && data.data[0].updated_time){

                lastTimeChecked = Math.floor(Date.parse(data.data[0].updated_time) / 1000);
            }

            callback(data);

        }, params);
    };


    /**
     * @function getEventFeed
     * @public
     */
    var getEventFeed = function(eventID, callback){

        getFeed(eventID, function(data){

            storedPosts = [];

            if(data && data.data){
               
                data.data.map(function(element){

                    storedPosts.push(element.id); 
                });
            }

            callback(data);

        });
    };


    /**
     * @function getEventFeedSince
     * @public
     */
    var getEventFeedSince = function(eventID, callback){

        getFeed(eventID, function(data){

            if(data && data.data){
                   
                data.data.filter(function(element){
                    
                    return storedPosts.indexOf(element.id) === -1;
                });

                data.data.map(function(element){

                    storedPosts.push(element.id); 
                });
            }

            callback(data);

        }, lastTimeChecked);
    };
    

    return {
        getEventPhotos: getEventPhotos,
        getUser: getUser,
        getEventUsers: getEventUsers,
        getEventFeed: getEventFeed,
        getEventFeedSince: getEventFeedSince
    }

})();

module.exports = facebookService;