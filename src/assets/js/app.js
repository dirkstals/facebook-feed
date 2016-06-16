
var socket,
    viewDOMElement,
    feedReactElement;


/**
 * @function _init
 * @private
 */
var _init = function(){

    viewDOMElement = document.getElementById('view');

    feedReactElement = ReactDOM.render(React.createElement(Feed), viewDOMElement);

    socket = io.connect();
    socket.on('refresh', _refreshPage);
    socket.on('data', feedReactElement.addLatestPosts);
}


/**
 * @function _refreshPage
 * @private
 */
var _refreshPage = function(users){
   
    window.location.reload();
};


_init();