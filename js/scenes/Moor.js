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
        this.load.image("background", "../../img/moor_tiny.jpg");
        this.load.image("bushes", "../../img/moor_bush_small.png");
        this.load.image("fence", "../../img/fence.png");
        this.load.image("car", "../../img/Objects/car.png");
        this.load.image("hag", "../../img/Objects/hag.png");
        this.load.image("detail", "../../img/Objects/detail.png");
        this.load.image("journal", "../../img/Objects/journal.png");

        //this.load.atlas('player', '../../img/player/Animation/PlayerAnimation.png', '../../img/player/Animation/PlayerAnimation.json');
        
        this.load.spritesheet("player", "../../img/player/Animation/PlayerAnimation.png", {
            frameWidth: 256, 
            frameHeight: 256 
        });

        this.load.animation("playerAnimations", "../../img/player/Animation/PlayerAnimation.json");

        /*
        this.load.spritesheet("npc01", "../../img/player/playerSprites.png", {
            frameWidth: 128, 
            frameHeight: 128 
        });
        */

        // Particles
        this.load.image("firefly", "../../img/firefly.png");


        // Load Physics body shapes from JSON file generated using PhysicsEditor
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

        //Game Components
        this.background = new Level(this, "background", 0);

        // Bushes overlay
        
        //var bushBody = this.matter.bodies.fromVertices(shapes.moor_bush.vertices);
        this.bushes = this.matter.add.image(0, 0, "bushes");
        this.bushes.setBody(shapes.bush_body);
        this.bushes.setStatic(true);
        this.bushes.x = this.sceneConfig.sceneWidth/2 + 130;
        this.bushes.y = this.sceneConfig.sceneHeight/2 + 675;
        //this.bushes.setOrigin(0, 0);
        this.bushes.setDepth(5);

        //var bushBody = this.matter.bodies.fromVertices(shapes.moor_bush.vertices);
        this.detail = this.add.image(0, 0, "detail");
        this.detail.x = this.sceneConfig.sceneWidth/2;
        this.detail.y = this.sceneConfig.sceneHeight/2;
        //this.bushes.setOrigin(0, 0);
        this.detail.setDepth(6);
        
        this.journal = this.add.image(0, 0, "journal");
        this.journal.x = 810;
        this.journal.y = 630;
        this.journal.setScale(0.3);
        //this.bushes.setOrigin(0, 0);
        this.journal.setDepth(6);

        this.fence = new Level(this, "fence", 0);

        this.car = new Car(this, shapes.car_body);

        this.player = new Player(this, shapes.player_body);

        this.hag = new NPC(this, "hag", shapes.hag_body);
        this.hag.setPosition(1800, 180);

        // Camera smooth following
        this.cameras.main.startFollow(this.player, false, 0.05, 0.05);

        // Physics
        this.matter.world.setBounds(0, 0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight);

        // Particle systems
        this.fireflyParticles = this.add.particles("firefly");
        var emissionCircle = new Phaser.Geom.Circle(0, 0, 1500);
        var emissionCircle2 = new Phaser.Geom.Circle(0, 0, 300);

        this.fireflyParticles.createEmitter({
            x: this.sceneConfig.sceneWidth/2,
            y: this.sceneConfig.sceneHeight/2,
            lifespan: 10000,
            gravityY: 0,
            scale: { start: 0, end: .5 },
            blendMode: 'ADD',
            quantity: 1,
            frequency: 50,
            emitZone: { type: 'random', source: emissionCircle },
            maxParticles: 300,
            particleClass: FireflyParticles // custom particle class definition in js/components/fireflyParticles.js
        });

        this.fireflyParticles.createEmitter({
            x: this.sceneConfig.sceneWidth/2+200,
            y: this.sceneConfig.sceneHeight - 800,
            lifespan: 10000,
            gravityY: 0,
            scale: { start: 0, end: .5 },
            blendMode: 'ADD',
            quantity: 1,
            frequency: 50,
            emitZone: { type: 'random', source: emissionCircle2 },
            maxParticles: 200,
            particleClass: FireflyParticles
        });

        //Collision checkers
        this.matter.world.on('collisionactive', function (event, bodyA, bodyB) {
            if(typeof bodyA.gameObject.handleCollision === 'function'){
                bodyA.gameObject.handleCollision(event.pairs, bodyB);
            }
            if(typeof bodyB.gameObject.handleCollision === 'function'){
                bodyB.gameObject.handleCollision(event.pairs, bodyA);
            }
        });

    }

    update(time, delta) {
        //Debug panel
        if(debug == true){
            if(this.debugPannel == null){
                this.debugPannel = document.getElementById("debugPannel");
            }

            this.debugPannel.innerHTML = "<b>DEBUG</b> <br>Player X Position: " + Math.round(this.player.x) + "<br>Player Y Position: " + Math.round(this.player.y);

        }

        this.player.movePlayer(.2 * delta, delta);

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