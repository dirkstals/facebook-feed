var Photo = React.createClass({
    displayName: 'Photo',
    getInitialState: function() {
        return {
            picture: ''
        };
    },
    componentDidMount: function() {

        fetch('/api/photo/' + this.props.item.object_id).then(function(response) {
            return response.json().then(function(data){

                this.setState({picture: data.images[0].source});
            }.bind(this));
        }.bind(this));
    },
    render: function() {
        return React.createElement(
            'div', 
            null,
            React.createElement(
                'img',
                {'src': this.state.picture}
            )
        );
    }
});