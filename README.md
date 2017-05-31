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
project](https://github.com/premasagar/sqwidget).  Just like
[Premasagar Rose](http://premasagar.com/)'s
[sandie](https://github.com/premasagar/sandie), we load JavaScript
from inside an iframe.  Then we provide access to a div or canvas
element.

## Working demo

Go to https://rawgit.com/kisonecat/asynchronous-interactive/master/examples/ to see a live demo.

## Getting Started

In the `<head>` include

```html
<script type="text/javascript" src="//unpkg.com/asynchronous-interactive"></script>
```

to load the code from this project from an
[npm](https://www.npmjs.com/package/asynchronous-interactive)
[cdn](https://unpkg.com/).  Once loaded, a `div` with class
`asynchronous-interactive` will have its `data-src` attribute
inspected, and the JavaScript pointed there will be loaded.

For instance, place interactive code in `sample.js`.  As a concrete
example, `sample.js` might consist of

```javascript
define(['canvas'],function(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, 200, 200);
    ctx.clearRect(30, 30, 140, 140);
    ctx.strokeRect(45, 45, 110, 110);
});
```

Then in your html file, load `sample.js` with

```html
<div class="asynchronous-interactive" data-src="sample.js" style="width: 200pt; height: 200pt;"></div>
```

# Instructions

The interactive graphics are stored as an [AMD
module](https://en.wikipedia.org/wiki/Asynchronous_module_definition), i.e., the JavaScript file looks like

```javascript
define(['module','names','go','here'], function(module,names,go,here) {
   // 'module' and such are loaded...
   // and this function is called with the expected parameters.
});
```

For example,
```javascript
define(['jquery'], function($) {
   // and now $ is what you expect it to be.
});
```

## Multiple versions

The names of modules are resolved via [the node package
manager](https://www.npmjs.com/), and can include versions such as

```javascript
define(['div', 'three@0.85.2'], function(container, THREE) {
    renderer = new THREE.CanvasRenderer(); 
    container.appendChild( renderer.domElement );

    // do more with three.js here
});
```

## Special module names

There are a few special module names:

* `div` refers to the container DOM element.
* `canvas` refers to a canvas element (created as a child of the parent div).
* `db` refers to a local "database" which, depending on the surrounding application, may be persisted for the current user.
