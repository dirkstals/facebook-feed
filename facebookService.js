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

        _options.path = path + '?' + serializedParameters + '&limit=10000';

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
     * @function getPhoto
     * @public
     */
    var getPhoto = function(photoId, callback){

        _get('/' + photoId, callback, [{'fields': 'images'}]);
    };



    /**
     * @function getUser
     * @public
     */
    var getUser = function(userId, callback){

        _get('/' + userId, callback, [{'fields': 'picture.type(large),name'}]);
    };


    /**
     * @function getGroupUsers
     * @public
     */
    var getGroupUsers = function(groupId, callback){

        _get('/' + groupId + '/members', callback, [{'fields': 'picture.type(large),name'}]);
    };


    /**
     * @function getFeed
     * @public
     */
    var getFeed = function(groupID, callback, since){

        var params = [{'fields': 'id,message,from,updated_time,attachments{title,target,media,type,subattachments.limit(1000)},comments.order(reverse_chronological)'}];

        if(since){

            params.push({'since': since});
        }
        
        _get('/' + groupID + '/feed', function(data){

            if(data.data && data.data.length > 0 && data.data[0] && data.data[0].updated_time){

                lastTimeChecked = Math.floor(Date.parse(data.data[0].updated_time) / 1000);
            }

            callback(data);

        }, params);
    };


    /**
     * @function getGroupFeed
     * @public
     */
    var getGroupFeed = function(groupID, callback){

        getFeed(groupID, function(data){

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
     * @function getGroupFeedSince
     * @public
     */
    var getGroupFeedSince = function(groupID, callback){

        getFeed(groupID, function(data){

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
        getUser: getUser,
        getPhoto: getPhoto,
        getGroupUsers: getGroupUsers,
        getGroupFeed: getGroupFeed,
        getGroupFeedSince: getGroupFeedSince
    }

})();

module.exports = facebookService;