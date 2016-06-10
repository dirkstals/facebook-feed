var Feed = React.createClass({
    displayName: 'Feed',
    i: 1,
    interval: null,
    timeout: null,
    delay: 10000,
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
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function(){
                    this.kenBurns();
                    this.interval = setInterval(this.kenBurns, this.delay);
                }.bind(this), this.delay / 3);

            }.bind(this));
        }.bind(this));
    },
    addLatestPosts: function(newPosts){

        clearInterval(this.interval);
        clearTimeout(this.timeout);

        var posts = this.state.feed.slice(0);     

        posts.splice.apply(posts, [this.i, 0].concat(newPosts));

        this.setState({feed: posts});

        this.timeout = setTimeout(function(){
            this.kenBurns();
        }.bind(this), 10);
        
        this.timeout = setTimeout(function(){
            this.kenBurns();
            this.interval = setInterval(this.kenBurns, this.delay);
        }.bind(this), this.delay * 2);
    },
    handleNewPosts: function(posts) {

        if(this.state.feed.length > 0){

            posts.unshift(this.state.feed[this.i - 1]);
        }
    
        this.i = 1;

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

        if(this.i == posts.length ){ 

            clearTimeout(this.timeout);
            this.timeout = setTimeout(this.getNewPosts, this.delay / 2);
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