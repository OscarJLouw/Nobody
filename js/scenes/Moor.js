class Moor extends Phaser.Scene {
    constructor()
    {
        // the "super" function makes this class inherit all characteristics of predecessor (the Phaser "Scene" class definition)
        super("MoorLevel");
    }

    sceneConfig = {
        sceneWidth: 5000,
        sceneHeight: 5000
    }

    // Loads all assets before scene starts
    preload(){
        this.load.image("background", "../../img/tilingGrass.png");
        this.load.spritesheet("player", "../../img/player/player_spritesheet.png", {
            frameWidth: 512,
            frameHeight: 512
        });
    }

    // Called when scene is loaded
    create(){
        // Set up events
        this.input.on('pointerdown', function (pointer){
            this.handleClick(pointer);
        }, this);

        // Background
        this.background = this.add.tileSprite(0,0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight, "background");
        this.background.setOrigin(0,0);

        // Sprites
        this.player = this.add.sprite(500, 500, "player");
        this.player.setOrigin(0.5,1);
        this.player.setScale(.3,.3);
        this.player.targetPosition = new Phaser.Math.Vector2(500, 500);
    }

    update(time, delta){
        this.movePlayer(0.6 * delta);
    }

    movePlayer(moveSpeed){
        var currentPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
        var moveDirection = new Phaser.Math.Vector2(currentPosition.x, currentPosition.y);
        moveDirection.subtract(this.player.targetPosition);
        var length = moveDirection.length();

        if(length > moveSpeed){
            moveDirection.normalize();
            moveDirection.scale(moveSpeed);
        }

        var newPosition = currentPosition.subtract(moveDirection);
        this.player.setPosition(newPosition.x, newPosition.y);
    }

    handleClick(pointer){
        this.player.targetPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
    }
}


/****** USEFUL FUNCTIONS ******/

/*

var randomX = Phaser.Math.Between(0, config.width);

this.add.text(20, 20, "Text goes here", {
    font: "25px Arial",
    fill: "yellow"
});

*/