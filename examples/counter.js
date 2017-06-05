define(['div', 'jquery', 'db'], function(div, $, db) {
    db.on('reset', function() {
	db.counter = 0;
    });

    $(div).on('click', function() {
	db.counter = db.counter + 1;
    });
    
    db.on('change', function() {
	$(div).html('You have clicked this ' + db.counter.toString() + ' time(s).');
    });
});
