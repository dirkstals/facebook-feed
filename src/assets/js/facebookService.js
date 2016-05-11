var https = require('https');

var facebookService = (function(){

    var _options = {
            host: 'graph.facebook.com'
        },
        lastTimeChecked;


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

        console.log("PATH: " + _options.path);

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
    var getEventUsers = function(eventId, callback){

        _get('/' + eventId, function(data){

            var attendingUserIds = data.attending ? data.attending.data.map(function(item){return item.id;}) : [];
            var noreplyUserIds = data.noreply ? data.noreply.data.map(function(item){return item.id;}) : [];
            var userIds = attendingUserIds.join(',') + ',' + noreplyUserIds.join(',');

            _get('/', callback, [{'ids': userIds}, {'fields': 'picture,name'}, {'type': 'large'}]);

        }, [{'fields': 'attending,noreply'}]);
    };


    /**
     * @function getEventFeed
     * @public
     */
    var getEventFeed = function(eventID, callback, since){

        var params = [{'fields': 'id,message,likes,type,object_id,from,updated_time'}];

        if(since){

            params.push({'since': since});
        }
        
        _get('/' + eventID + '/feed', function(data){

            if(data.data && data.data.length > 0 && data.data[0] && data.data[0].updated_time){

                lastTimeChecked = Math.floor(Date.parse(data.data[0].updated_time) / 1000);

                console.log("LAST TIME CHECKED: " + lastTimeChecked);
            }

            callback(data);

        }, params);
    };


    /**
     * @function getEventFeedSince
     * @public
     */
    var getEventFeedSince = function(eventID, callback){

        getEventFeed(eventID, callback, lastTimeChecked);
    };
    

    return {
        getEventPhotos: getEventPhotos,
        getEventUsers: getEventUsers,
        getEventFeed: getEventFeed,
        getEventFeedSince: getEventFeedSince
    }

})();

module.exports = facebookService;