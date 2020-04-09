class Moor extends Phaser.Scene {
    constructor()
    {
        // the "super" function makes this class inherit all characteristics of predecessor (the Phaser "Scene" class definition)
        super("MoorLevel");
    }

    // preload loads all assets before scene starts
    preload(){
        this.load.image("background", "../../img/tilingGrass.png");
        this.load.image("player", "../../img/placeholderPlayer.png");
    }

    // create is called when scene is loaded
    create(){
        this.player = this.add.image(100, 100, "player");
        this.player.setScale(.1,.1);

        this.input.on('pointerdown', function (pointer){
            this.movePlayer(pointer.x, pointer.y);
        }, this);

        this.background = this.add.image(0,0, "background");
        this.background.setOrigin(0,0);

        

        this.add.text(20,20,"Moor", {
            font: "25px Arial",
            fill: "yellow"
        });
    }

    update(){

    }

    movePlayer(pointerX, pointerY){
        this.player.setPosition(pointerX, pointerY);
    }

    
}

