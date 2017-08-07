define(['div', 'jquery', 'three@0.85.2'], function(container, $, THREE) {
    var clock = new THREE.Clock();
    var scene = new THREE.Scene();
    
    var SCREEN_WIDTH = $(container).width();
    var SCREEN_HEIGHT = $(container).height();
    
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    
    camera.position.set(0,150,400);
    camera.lookAt(scene.position);	
    
    // create and start the renderer; choose antialias setting.
    var renderer;
    if (window.WebGLRenderingContext)
	renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
	renderer = new THREE.CanvasRenderer(); 
    
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    
    container.appendChild( renderer.domElement );
    
    ///////////
    // LIGHT //
    ///////////
    
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    scene.add(light);
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
    
    //////////////
    // GEOMETRY //
    //////////////
    
    // Sphere parameters: radius, segments along width, segments along height
    var sphereGeometry = new THREE.SphereGeometry( 50, 32, 16 ); 
    var sphereMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} ); 
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(100, 50, -50);
    scene.add(sphere);
    
    // create a set of coordinate axes to help orient user
    var axes = new THREE.AxisHelper(100);
    scene.add( axes );

    /////////
    // SKY //
    /////////
    
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        
    function animate() 
    {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );	
    }

    animate();
});
