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
        this.load.image("fence", "../../img/fence.png");
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
            //speed: { min: Math.random()*10, max: Math.random()*20 },
            gravityY: 0,
            scale: { start: 0, end: .5 },
            blendMode: 'ADD',
            quantity: 1,
            frequency: 50,
            emitZone: { type: 'random', source: emissionCircle },
            maxParticles: 300,
            particleClass: FireflyParticles
        });

        this.fireflyParticles.createEmitter({
            x: this.sceneConfig.sceneWidth/2+200,
            y: this.sceneConfig.sceneHeight - 800,
            lifespan: 10000,
            //speed: { min: Math.random()*10, max: Math.random()*20 },
            gravityY: 0,
            scale: { start: 0, end: .5 },
            blendMode: 'ADD',
            quantity: 1,
            frequency: 50,
            emitZone: { type: 'random', source: emissionCircle2 },
            maxParticles: 200,
            particleClass: FireflyParticles
        });
    }

    update(time, delta) {
        

        if(debug == true){
            if(this.debugPannel == null){
                this.debugPannel = document.getElementById("debugPannel");
            }

            this.debugPannel.innerHTML = "<b>DEBUG</b> <br>Player X Position: " + Math.round(this.player.x) + "<br>Player Y Position: " + Math.round(this.player.y);

        }

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