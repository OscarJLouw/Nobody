class Moor extends Phaser.Scene {
    constructor() {
        // the "super" function makes this class inherit all characteristics of predecessor (the Phaser "Scene" class definition)
        super("MoorLevel");
    }

    sceneConfig = {
        sceneWidth: 3721,
        sceneHeight: 2489
    }

    // Loads all assets before scene starts
    preload() {
        this.load.image("background", "../../img/moor_small.jpg");
        this.load.image("bushes", "../../img/moor_bush_small.png");
        this.load.image("car", "../../img/car.png");
        this.load.image("hag", "../../img/hag.png");

        this.load.spritesheet("player", "../../img/player/playerSprites.png", {
            frameWidth: 128, 
            frameHeight: 128 
        });

        this.load.spritesheet("npc01", "../../img/player/playerSprites.png", {
            frameWidth: 128, 
            frameHeight: 128 
        });

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', '../../physics/physics-shapes.json');
    }

    // Called when scene is loaded
    create() {
        // Camera
        this.cameras.main.setBounds(0, 0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight);

        // Physics shapes
        var shapes = this.cache.json.get('shapes');

        // Set up events
        this.input.on('pointerdown', function (pointer) {
            this.handleClick(pointer);
        }, this);

        this.background = new Level(this, "background", 0);

        this.bushes = new Level(this, "bushes", 5);

        this.car = new Car(this, shapes.carBody);

        this.player = new Player(this, shapes.player);

        this.hag = new NPC(this, "hag", shapes.player);

        /*this.npc01 = this.matter.add.sprite(0, 0, "npc01");
        this.npc01.setBody(shapes.player);
        this.npc01.setOrigin(0.5, 1);
        this.npc01.setPosition(1200, 300);
        this.npc01.targetPosition = new Phaser.Math.Vector2(200, 200);
        this.npc01.setDepth(1);
        this.npc01.setStatic(true);*/

        // Camera smooth following
        this.cameras.main.startFollow(this.player, false, 0.05, 0.05);

        // Physics
        this.matter.world.setBounds(0, 0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight);
    }

    update(time, delta) {
        //this.movePlayer(.3 * delta);

        this.player.movePlayer(.3 * delta);

        //Change the layer depth of car and player
        if (this.player.y > this.car.y) {
            this.player.setDepth(2);
            this.car.setDepth(1);
        } else {
            this.player.setDepth(1);
            this.car.setDepth(2);
        }
    }

    handleClick(pointer) {
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