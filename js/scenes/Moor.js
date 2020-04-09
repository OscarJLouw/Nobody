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
        this.load.image("car", "../../img/placeholderCar.png");
        this.load.spritesheet("player", "../../img/player/playerSprites.png", {
            frameWidth: 128,
            frameHeight: 128
        });

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', '../../physics/physics-shapes.json');
    }

    // Called when scene is loaded
    create(){
        // Camera
        this.cameras.main.setBounds(0, 0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight);

        // Physics shapes
        var shapes = this.cache.json.get('shapes');

        // Set up events
        this.input.on('pointerdown', function (pointer){
            this.handleClick(pointer);
        }, this);

        // Background
        this.background = this.add.tileSprite(0,0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight, "background");
        this.background.setOrigin(0,0);

        this.car = this.matter.add.image(500,500, "car");
        this.car.setBody(shapes.carBody);

        this.car.setOrigin(0.5, 0.5);
        //this.car.setScale(0.8, 0.8);

        // Sprites
        this.player = this.matter.add.sprite(0, 0, "player");
        this.player.setBody(shapes.player);
        this.player.setOrigin(0.5,0.5);
        this.player.setPosition(200,200);
        //this.player.body.inertia = Infinity;
        //this.player.setScale(.3,.3);
        this.player.targetPosition = new Phaser.Math.Vector2(200, 200);

        // Camera smooth following
        this.cameras.main.startFollow(this.player, false, 0.05, 0.05);

        // Physics

        this.matter.world.setBounds(0, 0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight);
        
        /*
        this.matter.world.on('collisionstart', function (event, player, car) {

            player.gameObject.setTint(0xff0000);
            car.gameObject.setTint(0x00ff00);
    
        });
        */
    }

    update(time, delta){
        this.movePlayer(.3 * delta);
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

        if(length < 0.2){
            // idle
            this.player.setFrame(1);
        } else{
            if(Math.abs(moveDirection.x) > Math.abs(moveDirection.y)){
                if(moveDirection.x < 0){
                    // right
                    this.player.setFrame(3);
                } else if(moveDirection.x > 0){
                    // left
                    this.player.setFrame(2);
                }
            } else {
                if(moveDirection.y < 0){
                    // down
                    this.player.setFrame(1);
                } else if(moveDirection.y > 0)
                {
                    // up
                    this.player.setFrame(0);
                }
            }
        }

        //var newPosition = currentPosition.subtract(moveDirection);
        this.player.setVelocity(-moveDirection.x, -moveDirection.y);
        this.player.setAngle(0);

    }

    handleClick(pointer){
        this.player.targetPosition = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
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