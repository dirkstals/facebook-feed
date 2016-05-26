
var socket,
    socketStatusDomElement,
    socketTextDomElement,
    serverRestartButton,
    appRestartButton;


/**
 * @function _init
 * @private
 */
var _init = function(){

    socket = io.connect();

    socket.on('connect', _onConnectionHandler);
    socket.on('disconnect', _onDisconnectionHandler);
    socket.on('error', _onErrorHandler);

    socketStatusDomElement = document.getElementById('socket-status');    
    socketTextDomElement = document.getElementById('socket-text');    
    appRestartButton = document.getElementById('refresh');
    serverRestartButton = document.getElementById('restart');

    appRestartButton.addEventListener('click', _onAppRestartClickHandler, false);
    serverRestartButton.addEventListener('click', _onServerRestartClickHandler, false);
}


/**
 * @function _onConnectionHandler
 * @private
 */
var _onConnectionHandler = function(){
    
    socketStatusDomElement.classList.add('online');
    socketStatusDomElement.classList.remove('error');
    socketTextDomElement.textContent = 'connected';
};


/**
 * @function _onDisconnectionHandler
 * @private
 */
var _onDisconnectionHandler = function(){
    
    socketStatusDomElement.classList.remove('online');
    socketStatusDomElement.classList.remove('error');
    socketTextDomElement.textContent = 'disconnected';
};


/**
 * @function _onErrorHandler
 * @private
 */
var _onErrorHandler = function(error){
    
    socketStatusDomElement.classList.remove('online');
    socketStatusDomElement.classList.add('error');
    socketTextDomElement.textContent = 'error ' + error;
};


/**
 * @function _onAppRestartClickHandler
 * @private
 */
var _onAppRestartClickHandler = function(event){
 
    event.preventDefault();

    socket.emit('refresh');
    _spawnRipple(event);

    return false;  
}


/**
 * @function _onServerRestartClickHandler
 * @private
 */
var _onServerRestartClickHandler = function(event){
 
    event.preventDefault();

    socket.emit('restart');
    _spawnRipple(event);

    return false;  
}


/**
 * @function _spawnRipple
 * @private
 */
var _spawnRipple = function(e) {
    
    var target = e.target;

    var xPos = e.pageX - target.offsetLeft;
    var yPos = e.pageY - target.offsetTop;
    var color = target.getAttribute('data-ripple-color') || 'white';
    var opacity = target.getAttribute('data-ripple-opacity') || 0.5;

    var rippleEffect = document.createElement("span");
    rippleEffect.className = "ripple-effect";
    rippleEffect.style.left = xPos + 'px';
    rippleEffect.style.top = yPos + 'px';
    rippleEffect.style.backgroundColor = color;
    rippleEffect.style.opacity = opacity;

    target.appendChild(rippleEffect);
    setTimeout(function(){
        target.removeChild(rippleEffect);
    }.bind(target), 1000);
};

_init();