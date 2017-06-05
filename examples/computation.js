define(['div', 'jquery', 'another.js'], function(div, $, another) {
    var result = another.twoPlusTwo();
    $(div).text("2 + 2 = " + result.toString());
});
