# Asynchronous Interactive

A common desire for online math textbooks is to provide "interactive
figures," i.e., graphics that are, in some fashion, interactive so
that learners can explore a mathematical context, make discoveries,
form conjectures, etc.  A challenge is the format in which to store
such interactive graphics: there are platforms like
[Desmos](https://www.desmos.com/) and
[GeoGebra](https://www.geogebra.org/) but such platforms don't provide
the full power of JavaScript.

An "asynchronous interactive" is an interactive widget described via
JavaScript code stored in an [AMD
module](https://en.wikipedia.org/wiki/Asynchronous_module_definition).
This is similar to the [Sqwidget
project](https://github.com/premasagar/sqwidget) and like [Premasagar
Rose](http://premasagar.com/)'s
[sandie](https://github.com/premasagar/sandie), the widget's code is
loaded inside an iframe, but provided access to a div or canvas
element.

## Getting Started

In the `<head>` of your html document, include

```html
<script type="text/javascript" src="//unpkg.com/asynchronous-interactive"></script>
```

to load the code from this project.  Once loaded, a `div` with class
`asynchronous-interactive` will have its `data-src` attribute
inspected, and the JavaScript pointed there will be loaded.

For instance, place interactive code in `sample.js`.  As a concrete
example, `sample.js` might consist of

```javascript
define(['canvas'],function(canvas) {
    var width = canvas.width;
    var height = canvas.height;
    
    var ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, width, height);
    ctx.clearRect(30, 30, width-60, height-60);
    ctx.strokeRect(45, 45, width-90, height-90);
});
```

Then in your html file, load `sample.js` with

```html
<div class="asynchronous-interactive" data-src="sample.js" style="width: 200pt; height: 200pt;"></div>
```

