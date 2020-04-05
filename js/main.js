/* VARIABLES */
var camera, scene, renderer;
var textureLoader = new THREE.TextureLoader();
var clock = new THREE.Clock();
var deltaTime;

// Lights
var dirLight;

/* FUNCTIONS */
function Start()
{
    // Find HTML container to place renderer inside
    var container = document.getElementById( 'container' );

    // Create camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( 0, 0, 250 );

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );

    // Set up the 3D renderer
    SetupRenderer();

    // Add lights
    SetupLights();

    // Create world geometry
    CreateGeometry();

    // Handle window resizing
    window.addEventListener( 'resize', onWindowResize, false );
}

function SetupRenderer()
{
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Add renderer to the HTML container
    container.appendChild( renderer.domElement );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
}

function SetupLights()
{
    // DIRECTIONAL
    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );

    // Set up shadow casting
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    var d = 50;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

    // Add light to scene
    scene.add( dirLight );
}

function CreateGeometry()
{
    var grassTexture = textureLoader.load( "../img/tilingGrass.png" );

    grassTexture.anisotropy = 16;
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set( 512, 512 );
    
    // GROUND PLANE
    var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
    // Create material
    var groundMat = new THREE.MeshBasicMaterial( { color: 0xffffff, map: grassTexture } );

    var ground = new THREE.Mesh( groundGeo, groundMat );
    ground.position.y = - 33;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;

    // Add mesh to scene
    scene.add( ground );
}

function onWindowResize() {
    // Fix camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Resize the renderer
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function Update() {
    // Request the next update frame when update time has elapsed
    requestAnimationFrame(Update);

    // Render the scene
    Render();
}

function Render()
{
    deltaTime = clock.getDelta();
    renderer.render( scene, camera );
}

// Initialize the scene
Start();

// Start the update loop
Update();