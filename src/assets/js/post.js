var Post = React.createClass({
    displayName: 'Post',
    render: function() {
        return React.createElement(
            'div', 
            {className: 'post__message'},
            React.createElement(
                'p', 
                {className: 'message'},
                this.props.item.message
            )
        );
    }
});