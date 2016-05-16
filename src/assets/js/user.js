var User = React.createClass({
    displayName: 'User',
    getInitialState: function() {
        return {
            name: '',
            picture: ''
        };
    },
    componentDidMount: function() {

        fetch('/api/user/' + this.props.user.id).then(function(response) {
            return response.json().then(function(data){
                this.setState({name: data.name, picture: data.picture.data.url});
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
                this.state.name
            ),
            React.createElement(
                'img',
                {'src': this.state.picture}
            )
        );
    }
});