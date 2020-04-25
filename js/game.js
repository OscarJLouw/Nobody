var debug = true;

// Game configuration
var config = {
    type: Phaser.CANVAS,
    backgroundColor: '#d6c7a1',
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-game',
        width: '100%',
        height: '100%'
    },
    roundPixels: false,
    physics: {
        default: 'matter',
        matter: {
            
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [BootGame, Moor, Desert, Ocean] // list of scenes in the project
}

const debugOverlay = document.createElement('div');

debugOverlay.className = 'debug';
debugOverlay.id = 'debugPannel';
debugOverlay.innerHTML = 'DEBUG PANNEL';

var gameContainer = document.getElementById("phaser-game");
document.getElementById("content").insertBefore(debugOverlay, gameContainer);

if(debug == true){
    config.physics.matter.debug = {
        renderFill: false,
        showInternalEdges: true,
        showConvexHulls: true
    };
} else {
    disableDebug();
}

function enableDebug(){
    document.getElementById("debugPannel").style = "display:block";
}

function disableDebug(){
    document.getElementById("debugPannel").style = "display:none";
}

window.onkeyup = function(e){
    if(e.keyCode === 32 || e.key === ' '){
        debug = !debug;

        if(debug == true){
            enableDebug();
        } else {
            disableDebug();
        }
    }
}

// Create the game
var game = new Phaser.Game(config);