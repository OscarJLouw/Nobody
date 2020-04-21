class BootGame extends Phaser.Scene {
    constructor()
    {
        // the "super" function makes this class inherit all characteristics of predecessor (the Phaser "Scene" class definition)
        super("bootGame");
    }

    // preload loads all assets before scene starts
    preload(){
        
    }

    // create is called when scene is loaded
    create(){
        this.scale.on('resize', Resize, this);
        this.add.text(20,20,"Loading game...");

        // Load the first level
        this.scene.start("MoorLevel");
    }
}

// Resize game window with browser
function Resize (gameSize, baseSize, displaySize, resolution)
{
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);

    // Should manually reposition/scale all the elements here?
}