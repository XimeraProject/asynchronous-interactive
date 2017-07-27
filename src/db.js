var exports = module.exports = {};

exports.factory = function(id) {
    var handler = {
	get: function(target, name) {
	    if (target[name])
		return target[name];
	    else
		return JSON.parse(window.localStorage.getItem(window.location.pathname + '#' + id))[name];
	},
	
	set: function(target, name, value) {
	    target[name] = value;

	    var data = JSON.parse(window.localStorage.getItem(window.location.pathname + '#' + id));
		
	    if (!data)
		data = {};
	    data[name] = value;
		
	    window.localStorage.setItem(window.location.pathname + '/' + id, JSON.stringify(data));
		
	    if ('change' in target.handlers)
		target.handlers['change'].forEach( function(handler) { handler(); } );

	    return true;
	}
    };

    var db = {
	handlers: {},
	
	on: function(event, handler) {
	    if (db.handlers[event])
		db.handlers[event].push(handler);
	    else
		db.handlers[event] = [handler];

	    // Always execute onChange handlers as soon as they are registered
	    if (event == 'change') 
		handler();

	    // Only execute an onReset handlers if the dataase is empty
	    if (event == 'reset') {
		var data = window.localStorage.getItem(window.location.pathname + '#' + id);
		if ((!data) || (Object.keys(JSON.parse(data)).length == 0)) {
		    handler();
		}
	    }
	},

	clear: function() {
	    window.localStorage.clear();

	    if ('reset' in db.handlers)
		db.handlers['reset'].forEach( function(handler) { handler(); } );
	}
    };
    
    var proxy = new Proxy(db, handler);
    
    return proxy;
};
