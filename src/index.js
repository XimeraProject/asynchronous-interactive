var $ = require('jquery');
require('jquery-ui-bundle');
var _ = require('underscore');
var async = require('async');

function loadDependency( parent, window, div, item, callback ) {
    if (item == 'div') {
	callback(null,div);
	return;
    }

    if (item == 'canvas') {
	var canvas = document.createElement('canvas');
	canvas.width = div.scrollWidth;
	canvas.height = div.scrollHeight;
	div.appendChild(canvas);	
	callback(null,canvas);
	return;
    }

    var binding = undefined;
    
    // jsxgraph's package.json "main" points to the wrong place in
    // npm.  Even worse, JXG.JSXGraph.initBoard requires an id of a
    // div, but if we load it inside the iframe, then it doesn't see
    // the div.  Consequently, we load JSXGraph into the parent
    // document.
    if (item.match(/^jsxgraph/)) {
	item = item + "/distrib/jsxgraphcore.js";
	window = parent;
	binding = "JXG";
    }
    
    var script = window.document.createElement("script");
    
    var originalKeys = _.keys( window );
    
    var onLoad = function() {
	if (binding) {
	    callback(null, window[binding]);
	} else {
	    var changes = _.difference( _.keys(window), originalKeys );

	    var global = window[changes.pop()];
	
	    _.each( changes, function(change) {
		_.extend( global, window[change] );
	    });
	    
	    callback(null, global);
	}
    };

    script.type = "text/javascript";
    script.src = "https://unpkg.com/" + item;
    
    // On modern browsers
    script.onload=onLoad;
    // On IE
    script.onreadystatechange = function() {
        if (this.readyState == 'complete') {
            onLoad();
         }
    };
    
    // IE<9 doesn't understand document.head
    var head = window.document.getElementsByTagName("head")[0];
    head.appendChild(script);
}

$(function() {
    $('.asynchronous-interactive').each( function() {
	var div = $(this);
	div.uniqueId();
	
	// Create an iframe
	var iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	document.body.appendChild(iframe);

	// "define" is defined locally to load dependencies
	iframe.contentWindow.define = function(dependencies, callback) {
	    async.mapSeries( dependencies,
			     function( item, callback ) {
				 loadDependency(window, iframe.contentWindow, div.get(0), item, callback);
			     },
			     function(err, results) {
				 if (err) {
				     console.log(err);
				 } else {
				     callback.apply( div, results );
				 }
			     });
	};

	// Execute the interactive code
	var script = iframe.contentWindow.document.createElement("script");
	script.type = "text/javascript";
	script.src = div.attr('data-src');
	iframe.contentWindow.document.body.appendChild(script);
    });
});
