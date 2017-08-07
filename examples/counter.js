define(['div', 'jquery', 'db'], function(div, $, db) {
    db.on('reset', function() {
	db.counter = 0;
    });

    $(div).on('click', function() {
	db.counter = db.counter + 1;
    });

    db.other.on('change', function() {
	if (db.other.clicked) {
	    $(div).html('You have clicked this ' + db.counter.toString() + ' time(s).  YOU ALSO CLICKED THE SQUARE.');
	} else {
	    $(div).html('You have clicked this ' + db.counter.toString() + ' time(s).  You have not clicked the square.');	    
	}	
    });
    
    db.on('change', function() {
	if (db.other.clicked) {
	    $(div).html('You have clicked this ' + db.counter.toString() + ' time(s).  YOU ALSO CLICKED THE SQUARE.');
	} else {
	    $(div).html('You have clicked this ' + db.counter.toString() + ' time(s).  You have not clicked the square.');	    
	}
    });    
});
