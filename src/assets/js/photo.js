var Photo = React.createClass({
    displayName: 'Photo',
    render: function() {
        return React.createElement(
            'img', 
            {'src': this.props.image}
        );
    }
});