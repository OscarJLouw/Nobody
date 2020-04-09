// Game configuration with preloading and resize
var config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-game',
        width: '100%',
        height: '100%'
    },
    scene: {
        preload: Preload,
        create: Start
    }
}

var game = new Phaser.Game(config);

// Load images, sounds, etc
function Preload ()
{
}

// Initialize the game
function Start ()
{
    this.scale.on('resize', Resize, this);
}

// Resize game window with browser
function Resize (gameSize, baseSize, displaySize, resolution)
{
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);

    // Should manually reposition/scale all the elements here
}