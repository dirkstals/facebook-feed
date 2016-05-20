var Feed = React.createClass({
    displayName: 'Feed',
    getInitialState: function() {
        return {feed: []};
    },
    componentDidMount: function() {

        fetch('/api/feed').then(function(response) {
            return response.json().then(function(data){
                this.setState({feed: data.data});
            }.bind(this));
        }.bind(this));
    },
    handleNewPosts: function(posts) {

        Array.prototype.push.apply(posts.data, this.state.feed);

        this.setState({feed: posts.data});
    },
    render: function() {
        return React.createElement(
            'ul', 
            {'id': 'feed'},
            this.state.feed.map(function (item) {
                return React.createElement(
                    'li',
                    {'key': item.id},
                    React.createElement(User, {user: storedUsers[item.from.id]}),
                    React.createElement(item.type == 'photo' ? Photo : Post, {item: item})
                );
            })
        ); 
    }
});