var Post = React.createClass({
    displayName: 'Post',
    render: function() {
        return React.createElement(
            'p', 
            null,
            this.props.item.message
        );
    }
});