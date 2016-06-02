
var storedUsers = {},
    socket,
    viewDOMElement,
    feedReactElement;


/**
 * @function _init
 * @private
 */
var _init = function(){

    viewDOMElement = document.getElementById('view');

    socket = io.connect();

    socket.on('refresh', _refreshPage);

    fetch('/api/users').then(function (response) {
        return response.json().then(_getGroupUsersHandler);
    });

    feedReactElement = ReactDOM.render(React.createElement(Feed), viewDOMElement);
    
    socket.on('data', feedReactElement.handleNewPosts);
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
};


/**
 * @function _refreshPage
 * @private
 */
var _refreshPage = function(users){
   
    window.location.reload();
};


_init();