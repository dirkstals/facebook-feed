var Feed = React.createClass({
    displayName: 'Feed',
    i: 0,
    interval: null,
    timeout: null,
    delay: 15000,
    getInitialState: function() {
        return {
            feed: []
        };
    },
    componentDidMount: function() {

        this.getNewPosts(true);
    },
    getNewPosts: function(firstRun){
        
        fetch('/api/feed').then(function(response) {

            return response.json().then(function(data){

                this.handleNewPosts(data, firstRun);

                this.afterAWhile(this.kenBurns.bind(this), this.delay / 2);
            }.bind(this));
        }.bind(this));
    },
    addLatestPosts: function(newPosts){

        var posts = this.state.feed.slice(0);     

        posts.splice.apply(posts, [this.i, 0].concat(newPosts));

        this.replaceState({feed: posts});

        this.afterAWhile(this.kenBurns.bind(this), 10);
    },
    handleNewPosts: function(posts, firstRun) {

        if(this.state.feed.length > 0){

            posts.unshift(this.state.feed[this.i - 1]);
        }
    
        this.i = 1;

        if(firstRun){

            posts[0].className = 'fx';
        }

        this.replaceState({feed: posts});
    },
    kenBurns: function() {

        var posts = this.state.feed;

        if(this.i == posts.length){ this.i = 0;}

        // we can't remove the class from the previous element or we'd get a bouncing effect so we clean up the one before last
        // (there must be a smarter way to do this though)
        if(this.i===0){ posts[posts.length-2].className = '';}
        if(this.i===1){ posts[posts.length-1].className = '';}
        if(this.i > 1){ posts[this.i-2].className = '';}
console.log(this.i, posts[this.i]);
        posts[this.i].className = 'fx';

        this.setState({feed: posts});

        this.i++;
        
        this.afterAWhile(this.kenBurns, this.delay);

        if(this.i == posts.length ){ 

            this.afterAWhile(this.getNewPosts, this.delay / 2);
        }
    },
    afterAWhile: function(callback, delay){
        
        clearTimeout(this.timeout);
        this.timeout = setTimeout(callback, delay);
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
                            React.createElement('img', {className: 'from', src: item.from})
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