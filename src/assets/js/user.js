var User = React.createClass({
    displayName: 'User',
    render: function() {
        return React.createElement(
            'div', 
            {className: 'post__from'},
            React.createElement(
                'img',
                {'src': this.props.user.picture, className: 'from'}
            )
        );
    }
});