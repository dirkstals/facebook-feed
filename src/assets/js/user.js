var User = React.createClass({
    displayName: 'User',
    getInitialState: function() {
        return {feed: []};
    },
    componentDidMount: function() {

        fetch('/api/user?userid=' + this.props.item.from.id).then(function(response) {
            return response.json().then(function(data){
                this.setState({feed: data.data});
            }.bind(this));
        }.bind(this));
    },
    render: function() {
        return React.createElement(
            'div', 
            null,
            React.createElement(
                'span',
                null,
                data.name
            ),
            React.createElement(
                'img',
                {'src': data.picture}
            )
        );
    }
});