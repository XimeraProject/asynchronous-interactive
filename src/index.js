var $ = require('jquery');
require('jquery-ui-bundle');
var _ = require('underscore');
var async = require('async');
var db = require('./db');

var MODULES = {};

// By using a named "eval" most browsers will execute in the global scope.
// http://www.davidflanagan.com/2010/12/global-eval-in.html
var globalEval = eval;

function specials(name, context) {
    if (name == 'canvas') {
	var div = context.div;
	
	if (!(context.canvas)) {
	    context.canvas = window.document.createElement('canvas');
	    context.canvas.width = $(div).width();
	    context.canvas.height = $(div).height();
	    div.appendChild(context.canvas);
	}
	
	return context.canvas;
    }	
	
    if (name == 'div') {
	return context.div;
    }

    if (name == 'db') {
	return context.db;
    }
    
    if (name == 'jquery') {
	return $;
    }

    return undefined;
}

function asynchronousRequire(moduleName, topLevel, context, callback) {
    if (specials(moduleName, context)) {
	callback( null, specials(moduleName, context) );
	return;
    }
    
    if (MODULES[moduleName]) {
	callback( null, MODULES[moduleName].exports );
	return;	
    }

    var location = moduleName;

    if (location.match(/\.js$/)) {
	location = location;
    } else {
	if (location.match(/^jsxgraph/))
	    location = "https://unpkg.com/" + location + "/distrib/jsxgraphcore.js";
	else
	    location = "https://unpkg.com/" + location;
    }

    var request = new XMLHttpRequest();

    var binding = undefined;
    if (moduleName.match(/^jsxgraph/)) {    
	binding = "JXG";
    }
    
    request.onload = function () {
        if (request.status == 200) {
	    var deps = {};
            request.response.replace(/(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g, function (_, id) {
                deps[id] = true;
            });

	    if (binding) deps = {};
	    
	    async.mapSeries( Object.keys(deps),
		       function(dependency, callback) {
			   asynchronousRequire( dependency, false, context, callback );	
		       },
		       function(err, results) {
			   if (err) {
			       callback( err, {} );			       
			   } else {
			       var module = { exports: {} };
			   
			       if (!topLevel)
				   MODULES[moduleName] = module;

			       // Some modules don't like our module loader
			       if (binding) {
				   globalEval(request.response);
				   module = window[binding];
				   callback( null, module );
			       } else {
				   (globalEval("(function(require,define,exports,module){" + request.response + "\n})//# sourceURL=" + location))(
				       function require (id) {
					   if (specials(id, context)) {
					       return specials(id, context);
					   } else
					       return MODULES[id].exports;
				       }, // require
				       function define( dependencies, code ) {
					   async.mapSeries( dependencies,
							    function( item, callback ) {
								asynchronousRequire( item, false, context, callback );
							    },
							    function(err, results) {
								module.exports = code.apply( context.div,
											     results );
							    });
				       },
				       module.exports, // exports
				       module
				   );
			       
				   callback( null, module.exports );
			       }
			   }
		       });
	}
    };
	
    request.open("GET", location, true);
    request.send();
}

$(function() {
    $('.asynchronous-interactive').each( function() {
	var div = $(this);
	div.uniqueId();
	var id = $(this).attr('id');
	var src = div.attr('data-src');

	var context = { div: div.get(0),
		        db: db.factory(id)
		      };
	
	asynchronousRequire( "./" + src,
			     true, // this is a top-level require
			     context,
			     function(err) {
				 console.log(err);
			     });
    });
});
