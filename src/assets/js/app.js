
var storedUsers = {};

var getEventUsersHandler = function(users){

    Object.keys(users).map(function(key){
        storedUsers[key] = {
            name: users[key].name,
            picture: users[key].picture.data.url,
        }
    });
};

var getEventPhotosHandler = function(photos){

    ReactDOM.render(
        React.createElement(
            'ul', 
            null,
            Object.keys(photos).map(function (key) {
                
                return React.createElement(
                    'li',
                    {'key': key},
                    React.createElement(User, {'user': storedUsers[photos[key].from.id]}),
                    React.createElement(Photo, {'image': photos[key].images[0].source})
                );
            })
        ),
        document.getElementById('view')
    );   
};

var host = location.origin.replace(/^http/, 'ws')

var socket = io.connect(host);
    
socket.on('data', function (data) {
    
    console.log(data);
});


fetch('/api/users').then(function (response) {
    return response.json().then(function(users) {
        getEventUsersHandler(users);

        fetch('/api/photos').then(function (response) {
            return response.json().then(function(photos) {
                getEventPhotosHandler(photos);
            });
        });     
    });
});