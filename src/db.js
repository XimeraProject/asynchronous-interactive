var exports = module.exports = {};
var _ = require('underscore');

// This is a polyfill attaching to global scope
require('setimmediate');

var changesToNotify = [];
var willNotify = false;
function notifyChanges() {
    changesToNotify.forEach( function(target) {
	target.stopPropagating = true;
	target.handlers['change'].forEach( function(handler) { handler(); } );
	delete target.stopPropagating;
    } );
    
    changesToNotify = [];
    willNotify = false;
}

var databases = {};

exports.factory = function(id) {
    if (databases[id])
	return databases[id];
    
    var handler = {
	get: function(target, name) {
	    if (target[name]) {
		return target[name];
	    } else {
		// Check to see if this is a reference to another database
		var element = document.getElementById(id);
		if ((element) && (element.getAttribute('data-' + name))) {
		    var other = element.getAttribute('data-' + name);
		    if (other.substr(0,1) == '#') {
			if (databases[other.substr(1)])
			    return databases[other.substr(1)];
			else
			    return exports.factory(other.substr(1));
		    } else {
			return eval(other);
		    }
		}
		
		var data = JSON.parse(window.localStorage.getItem(window.location.pathname + '#' + id));
		if ((data) && (name in data))
		    return data[name];
		else
		    return undefined;
	    }
	},
	
	set: function(target, name, value) {
	    target[name] = value;

	    var data = JSON.parse(window.localStorage.getItem(window.location.pathname + '#' + id));
		
	    if (!data)
		data = {};
	    data[name] = value;
		
	    window.localStorage.setItem(window.location.pathname + '#' + id, JSON.stringify(data));

	    // Do not call this from within the change handler
	    if (('change' in target.handlers) && (!(target.stopPropagating))) {
		// Only call this ONCE after this cycle through the event loop		
		if (changesToNotify.indexOf( target ) < 0) {
		    changesToNotify.push( target );
		    if (!willNotify) {
			willNotify = true;
			setImmediate( notifyChanges );
		    }
		}
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
	    if (event == 'change') {
		handler();
	    }

	    // Only execute an onReset handlers if the dataase is empty
	    if (event == 'reset') {
		var data = window.localStorage.getItem(window.location.pathname + '#' + id);
		if ((!data) || (Object.keys(JSON.parse(data)).length == 0)) {
		    handler();
		}
	    }
	},

	clear: function() {
	    window.localStorage.setItem(window.location.pathname + '#' + id, "{}");

	    if ('reset' in db.handlers)
		db.handlers['reset'].forEach( function(handler) { handler(); } );
	}
    };
    
    var proxy = new Proxy(db, handler);
    databases[id] = proxy;
    
    return proxy;
};
