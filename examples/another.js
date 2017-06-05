define(['deeper-left.js', 'deeper-right.js'], function(left, right) {
    return {
	twoPlusTwo: function() {
	    return left.thing() + right.otherThing();
	}
    };
});
