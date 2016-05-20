var Feed = React.createClass({
    displayName: 'Feed',
    getInitialState: function() {
        return {feed: []};
    },
    componentDidMount: function() {

        fetch('/api/feed').then(function(response) {
            return response.json().then(function(data){
                
                this.setState({feed: data.data});
                this.createSlideshowFromPhotos();
            }.bind(this));
        }.bind(this));
    },
    handleNewPosts: function(posts) {

        Array.prototype.push.apply(posts.data, this.state.feed);

        this.setState({feed: posts.data});

        this.createSlideshowFromPhotos();
    },
    createSlideshowFromPhotos: function(){

         this.state.feed.map(function(item){

            if(item.attachments && item.attachments.data && item.attachments.data.length > 0){

                item.attachments.data.map(function(attachment){
                    if(attachment.subattachments && attachment.subattachments.data  && attachment.subattachments.data.length > 0){
                        attachment.subattachments.data.map(function(subattachment){
                            slideshowReactElement.addNewImage(subattachment.media.image.src);    
                        });
                    }else{
                        slideshowReactElement.addNewImage(attachment.media.image.src);
                    }
                })                        
            }
        });
    },
    render: function() {
        return React.createElement(
            'ul', 
            {'id': 'feed'},
            this.state.feed.map(function (item) {
                return React.createElement(
                    'li',
                    {'key': item.id},
                    React.createElement(User, {user: storedUsers[item.from.id]}),
                    React.createElement(Post, {item: item})
                );
            })
        ); 
    }
});