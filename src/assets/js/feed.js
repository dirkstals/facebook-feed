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
        });
    },
    handleNewPosts: function(posts) {
        
        this.setState({feed: this.props.feed.push.apply(posts.data)});
    },
    render: function() {
        return React.createElement(
            'ul', 
            {'id': 'feed'},
            this.props.feed.map(function (item) {
                return React.createElement(
                    'li',
                    {'key': item.id},
                    React.createElement('p', null, item.message)
                );
            })
        ); 
    }
});