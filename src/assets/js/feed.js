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
        
        Array.prototype.push.apply(this.state.feed, posts.data);

        this.setState({feed: this.state.feed});
    },
    render: function() {
        console.log(this.state);
        return React.createElement(
            'ul', 
            {'id': 'feed'},
            this.state.feed.map(function (item) {
                return React.createElement(
                    'li',
                    {'key': item.id},
                    React.createElement('p', null, item.message)
                );
            })
        ); 
    }
});