
var storedUsers = {},
    socket,
    viewDOMElement,
    feedReactElement,
    slideshowReactElement,
    slideshowDOMElement;


/**
 * @function _init
 * @private
 */
var _init = function(){

    viewDOMElement = document.getElementById('view');
    slideshowDOMElement = document.getElementById('slideshowcontainer');

    socket = io.connect();

    fetch('/api/users').then(function (response) {
        return response.json().then(_getGroupUsersHandler);
    });

}


/**
 * @function _getGroupUsersHandler
 * @private
 */
var _getGroupUsersHandler = function(users){
    
    users.data.map(function(user){
        storedUsers[user.id] = {
            name: user.name,
            picture: user.picture.data.url,
        }
    });

    slideshowReactElement = ReactDOM.render(React.createElement(Slideshow), slideshowDOMElement);
    feedReactElement = ReactDOM.render(React.createElement(Feed), viewDOMElement);
    
    socket.on('data', feedReactElement.handleNewPosts);
};


_init();