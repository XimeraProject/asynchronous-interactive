define(['canvas'],function(canvas) {
    var width = canvas.width;
    var height = canvas.height;
    
    var ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, width, height);
    ctx.clearRect(30, 30, width-60, height-60);
    ctx.strokeRect(45, 45, width-90, height-90);
});
