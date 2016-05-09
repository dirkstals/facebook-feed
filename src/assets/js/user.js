var User = React.createClass({
    displayName: 'User',
    render: function() {
        return React.createElement(
            'div', 
            null,
            React.createElement(
                'span',
                null,
                this.props.user.name
            ),
            React.createElement(
                'img',
                {'src': this.props.user.picture}
            )
        );
    }
});