// Game configuration
var config = {
    type: Phaser.CANVAS,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-game',
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'matter',
        matter: {
            /*
            debug: {
                renderFill: false,
                showInternalEdges: true,
                showConvexHulls: true
            },
            */
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [BootGame, Moor] // list of scenes in the project
}

// Create the game
var game = new Phaser.Game(config);