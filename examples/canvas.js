define(['canvas', 'jquery', 'db'],function(canvas, $, db) {
    var width = canvas.width;
    var height = canvas.height;
    
    db.on('change', function() {
	var ctx = canvas.getContext('2d');
	ctx.fillRect(0, 0, width, height);
	ctx.clearRect(30, 30, width-60, height-60);
	ctx.fillRect(45, 45, width-90, height-90);

	if (db.clicked) {
	    ctx.clearRect(50, 50, width-100, height-100);	    
	    ctx.fillRect(55, 55, width-110, height-110);
	}
    });
    
    $(canvas).on('click', function() {
	db.clicked = ! db.clicked;
    });
});
