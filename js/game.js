// Game configuration
var config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-game',
        width: '100%',
        height: '100%'
    },
    scene: [BootGame, Moor] // list of scenes in the project
}

// Create the game
var game = new Phaser.Game(config);