var Slideshow = React.createClass({
    displayName: 'Slideshow',
    i: 1,
    interval: null,
    lastImage: 0,
    getInitialState: function() {
        return {images: []};
    },
    componentDidUpdate: function() {

        clearInterval(this.interval);
        this.interval = setInterval(this.kenBurns, 10000);     
    },
    componentDidMount: function(){

        setTimeout(function(){
            document.body.classList.add('loaded');
        }, 3000);
    },
    addNewImages: function(newImages) {
        
        clearInterval(this.interval);

        var found = 
            newImages.some(function(newImage){
                return this.state.images.some(function (image) {
                    return image.id === newImage.id;
                });
            }.bind(this));
        
        if (!found) { 

            var images = this.clearImages();
            newImages[0].className = "fx";
            this.i = images.length;
            this.setState({images: images.concat(newImages)});
        }
    },
    clearImages: function(){

        var images = this.state.images;

        images.map(function (item) {
            item.className = "";
            return item;
        });

        return images;
    },
    kenBurns: function() {

        var images = this.state.images;

        if(this.i==images.length){ this.i = 0;}

        images[this.i].className = "fx";

        // we can't remove the class from the previous element or we'd get a bouncing effect so we clean up the one before last
        // (there must be a smarter way to do this though)
        if(this.i===0){ images[images.length-2].className = "";}
        if(this.i===1){ images[images.length-1].className = "";}
        if(this.i > 1){ images[this.i-2].className = "";}

        this.setState({images: images});

        this.i++;
    },
    render: function() {
        return React.createElement(
            'div', 
            {id: 'slideshow'},
            this.state.images.map(function (image) {
                return React.createElement(
                    'div',
                    {
                        key: image.id, 
                        style: { backgroundImage: 'url("' + image.src + '")'} , 
                        className: image.className
                    }
                );
            })
        ); 
    }
});
