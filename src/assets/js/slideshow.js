var Slideshow = React.createClass({
    displayName: 'Slideshow',
    i: 0,
    interval: null,
    getInitialState: function() {
        return {images: []};
    },
    componentDidUpdate: function() {

        clearInterval(this.interval);
        this.interval = setInterval(this.kenBurns, 6000);     
    },
    addNewImage: function(image) {

        this.setState({images: this.state.images.concat([{src: image}])});
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
            this.state.images.map(function (image, index) {
                return React.createElement(
                    'div',
                    {
                        key: index, 
                        style: { backgroundImage: 'url("' + image.src + '")'} , 
                        className: image.className
                    }
                );
            })
        ); 
    }
});
