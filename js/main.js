/* VARIABLES */
var camera, scene, renderer;
var textureLoader = new THREE.TextureLoader();
var clock = new THREE.Clock();
var deltaTime;

// Lights
var dirLight;

// Gameplay objects
var player = new THREE.Group();

/* FUNCTIONS */
function Start()
{
    // Find HTML container to place renderer inside
    var container = document.getElementById( 'container' );

    // Create camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 10, 8);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );

    scene.fog = new THREE.FogExp2( 0xffffff, 0.02 );

    // Set up the 3D renderer
    SetupRenderer();

    // Add lights
    // SetupLights();

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
    /* GRASS */
    // Texture
    var grassTexture = textureLoader.load( "../img/tilingGrass.png" );
    grassTexture.anisotropy = 16;
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set( 2048, 2048 );
    
    // Geometry
    var planeGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );

    // Material
    var grassMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, map: grassTexture } );

    // Add mesh to scene
    var ground = new THREE.Mesh( planeGeometry, grassMaterial );
    ground.rotation.x = -Math.PI / 2;
    scene.add( ground );

    /* PLAYER CHARACTER */
    player.playerTexture = textureLoader.load( "../img/placeholderSpritesheet.png" );
    var playerMaterial = new THREE.SpriteMaterial( { map: player.playerTexture, color: 0xffffff, fog: true } );
    var playerSprite = new THREE.Sprite( playerMaterial );
    
    playerSprite.center.set(0.5, 0);

    playerSprite.wrapS = playerSprite.wrapT = THREE.RepeatWrapping;
    player.playerTexture.repeat.set(0.25,1);
    player.playerTexture.offset.set(0,0);

    playerSprite.position.set(0,0,0);

    // Create animation variables
    player.currentFrame = 0;
    player.frames = 4;
    player.animationUpdateTime = 0.15;
    player.currentTime = 0;

    player.add(playerSprite);

    scene.add(player);
}

function onWindowResize() {
    // Fix camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Resize the renderer
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function Update() {
    deltaTime = clock.getDelta();

    // Update player animation
    player.currentTime += deltaTime;
    if(player.currentTime >= player.animationUpdateTime){
        player.currentTime = 0;
        player.currentFrame += 1;
        if(player.currentFrame >= player.frames){
            player.currentFrame = 0;
        }
        
        player.playerTexture.offset.set(player.currentFrame/player.frames,0);
    }

    // Request the next update frame when update time has elapsed
    requestAnimationFrame(Update);

    // Render the scene
    Render();
}

function Render()
{
    renderer.render( scene, camera );
}

// Initialize the scene
Start();

// Start the update loop
Update();