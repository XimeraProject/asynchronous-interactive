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
    var script = window.document.createElement("script");
    var waitForDefine = false;
    
    // jsxgraph's package.json "main" points to the wrong place in
    // npm.  Even worse, JXG.JSXGraph.initBoard requires an id of a
    // div, but if we load it inside the iframe, then it doesn't see
    // the div.  Consequently, we load JSXGraph into the parent
    // document.
    if (item.match(/^jsxgraph/)) {
	script.src = "https://unpkg.com/" + item + "/distrib/jsxgraphcore.js";
	window = parent;
	binding = "JXG";
    } else if (item.match(/\.js$/)) {
	script.src = item;
	waitForDefine = true;
    } else {
	script.src = "https://unpkg.com/" + item;
    }
    
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

    if (waitForDefine) {
	window.define = function(dependencies, code) {
	    async.mapSeries( dependencies,
			     function( item, callback ) {
				 loadDependency(parent, window, div, item, callback);
			     },
			     function(err, results) {
				 if (err) {
				     callback( err, null );
				 } else {
				     callback( null, code.apply( div, results ) );
				 }
			     });
	};
    } else {
	// On modern browsers
	script.onload=onLoad;
	// On IE
	script.onreadystatechange = function() {
            if (this.readyState == 'complete') {
		onLoad();
            }
	};
    }
    
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

	var loaded = function() { 
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
	    var iframeDocument = iframe.contentDocument;
	    if (!iframeDocument && iframe.contentWindow) {
		iframeDocument = iframe.contentWindow.document;
	    }
	    var script = iframeDocument.createElement("script");
	    
	    script.type = "text/javascript";
	    script.src = div.attr('data-src');
	    script.async = true;
	    iframeDocument.getElementsByTagName('head')[0].appendChild(script);
	};

        if(iframe.addEventListener)
            iframe.addEventListener('load', loaded, true);
        else if(iframe.attachEvent)
            iframe.attachEvent('onload',loaded);

	document.body.appendChild(iframe);	
    });
});
