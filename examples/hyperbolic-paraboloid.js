var container = require('div');
var $ = require('jquery');
var THREE = require('three@0.86');
console.log("THREE",THREE);
var clock = new THREE.Clock();
var scene = new THREE.Scene();

require('./trackball-controls.js')(THREE);

var SCREEN_WIDTH = $(container).width();
var SCREEN_HEIGHT = $(container).height();
var width = $(container).width();
var height = $(container).height();    

var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
scene.add(camera);

camera.position.set(0,150,400);
camera.lookAt(scene.position);	
    
var renderer = new THREE.WebGLRenderer( {antialias:true, alpha: true} );

var scene = new THREE.Scene();

renderer.setSize(width, height);
// listener for window resize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    var width=$(container).width();
    var height = $(container).height();    	
    camera.aspect = ASPECT;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);	
}

container.append( renderer.domElement );

var VIEW_ANGLE = 10, ASPECT = width / height, NEAR = 10.0, FAR = 20000;
var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
scene.add(camera);

camera.position.set(15,30,20);
camera.up = new THREE.Vector3(0,0,1);
camera.lookAt(scene.position);	

var controls = new THREE.TrackballControls( camera, renderer.domElement );

controls.rotateSpeed = 2.0;
controls.panSpeed = 0.01;
controls.staticMoving = true;

function f_surface(u,v) {
    var x = 4*u-2;
    var y = 4*v-2;
    var z = x*x-y*y;
    
    return new THREE.Vector3(x, y, z);
}


var Nu=30, Nv=80;

var surfaceGeometry = new THREE.ParametricGeometry(f_surface, Nu, Nv, ! true);

var surfaceMaterial = new THREE.MeshLambertMaterial({color: 0x999999, opacity: 0.9, transparent: false});
surfaceMaterial.side = THREE.DoubleSide;

var thesurface = new THREE.Mesh( surfaceGeometry, surfaceMaterial )
thesurface.draggable = false;
scene.add(thesurface);

// Colored lights
var light = new THREE.DirectionalLight( 0xff0000 );
light.position.set( 10, 10, 10 );
scene.add( light );
light = new THREE.DirectionalLight( 0x00ff00 );
light.position.set( 10, -10, 10 );
scene.add( light );
light = new THREE.DirectionalLight( 0x0000ff );
light.position.set( -10, -10, 10 );
scene.add( light );
light = new THREE.DirectionalLight( 0x555555 );
light.position.set( 0, 0, -10 );
scene.add( light );

light = new THREE.AmbientLight( 0x222222 );
scene.add( light );

// animation loop / game loop
animate();

function animate() {
    requestAnimationFrame( animate );
    render();
    controls.update();
}

function render() {
    renderer.render( scene, camera );
}


