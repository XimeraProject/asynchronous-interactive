var exports = module.exports = {};

exports.factory = function() {
    var handler = {
	get: function(target, name) {
	    if (target[name])
		return target[name];
	    else
		return JSON.parse(window.localStorage.getItem(name));
	},
	
	set: function(target, name, value) {
	    if (target[name])
		target[name] = value;
	    else {
		window.localStorage.setItem(name, JSON.stringify(value));
		if ('change' in target.handlers)
		    target.handlers['change'].forEach( function(handler) { handler(); } );
	    }
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
	    if ((event == 'reset') && (Object.keys(window.localStorage).length == 0))
		handler();
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
