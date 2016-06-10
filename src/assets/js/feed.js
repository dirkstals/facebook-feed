var Feed = React.createClass({
    displayName: 'Feed',
    i: 1,
    interval: null,
    getInitialState: function() {
        return {
            feed: []
        };
    },
    componentDidMount: function() {

        this.getNewPosts();
    },
    getNewPosts: function(delay){
        
        fetch('/api/feed').then(function(response) {

            return response.json().then(function(data){

                this.handleNewPosts(data);

                clearInterval(this.interval);
                setTimeout(function(){
                    this.kenBurns();
                    this.interval = setInterval(this.kenBurns, 10000);
                }.bind(this), 5000);

            }.bind(this));
        }.bind(this));
    },
    addLatestPosts: function(newPosts){

        var posts = this.state.feed.slice(0);     

        posts.splice.apply(posts, [this.i + 1, 0].concat(newPosts));

        this.setState({feed: posts});

        clearInterval(this.interval);
        this.kenBurns();
        setTimeout(function(){
            this.kenBurns();
            this.interval = setInterval(this.kenBurns, 10000);
        }.bind(this), 20000);
    },
    handleNewPosts: function(posts) {

        if(this.state.feed.length > 0){
            posts.unshift(this.state.feed[this.i]);
            this.i = 1;
        }

        posts[0].className = 'fx';

        this.setState({feed: posts});
    },
    kenBurns: function() {

        var posts = this.state.feed;

        if(this.i == posts.length){ this.i = 0;}

        posts[this.i].className = 'fx';

        // we can't remove the class from the previous element or we'd get a bouncing effect so we clean up the one before last
        // (there must be a smarter way to do this though)
        if(this.i===0){ posts[posts.length-2].className = '';}
        if(this.i===1){ posts[posts.length-1].className = '';}
        if(this.i > 1){ posts[this.i-2].className = '';}

        this.setState({feed: posts});

        this.i++;

        if(this.i == posts.length){ 

            setTimeout(this.getNewPosts, 5000);
        }
    },
    render: function() {
        return this.state.feed.length == 0 ? null : React.createElement(
            'div', 
            {className: 'post__container'},
            this.state.feed.map(function (item) {

                return React.createElement(
                    'div',
                    {key: item.id, className: item.className},
                    React.createElement(
                        'div', 
                        {className: 'post__picture'},
                        React.createElement('div', {className: 'picture', style: {backgroundImage: 'url("' + item.src + '")'}})
                    ),
                    React.createElement(
                        'div', 
                        {className: 'post__bottom'},
                        React.createElement(
                            'div', 
                            {className: 'post__from'},
                            React.createElement('img', {className: 'from', src: storedUsers[item.from.id].picture})
                        ),
                        React.createElement(
                            'div', 
                            {className: 'post__message'},
                            React.createElement('p', {className: 'message'}, item.message)
                        )
                    )
                );
            })
        ); 
    }
});