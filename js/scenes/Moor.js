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

        this.brushes = ["brush1", "brush2", "brush3"];

        this.comicManager = new ComicManager(this);
        this.comicManager.loadComics(this);

        this.interactableList = [];

    }

    // Called when scene is loaded
    create() {
        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0xffffff, 1);
        this.overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.overlay.setScrollFactor(0);
        this.overlay.setDepth(99999);

        // Camera
        this.cameras.main.setBounds(0, 0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight);

        // Physics shapes
        var shapes = this.cache.json.get('shapes');

        // Set up events
        this.input.on('pointerdown', function (pointer) {
            this.handleClick(pointer);
        }, this);

        this.input.on('gameobjectdown', function(pointer, gameObject) {
            this.onObjectClicked(pointer, gameObject);
        }, this);

        //Game Components
        this.background = new Level(this, "background", 0);
        this.interactableList.push(this.background);

        // Bushes overlay
        this.bushes = this.matter.add.image(0, 0, "bushes");
        this.bushes.setBody(shapes.bush_body);
        this.bushes.setStatic(true);
        this.bushes.x = this.sceneConfig.sceneWidth / 2 + 130;
        this.bushes.y = this.sceneConfig.sceneHeight / 2 + 675;
        this.bushes.setDepth(5000);

        // Detail objects
        this.detail = this.add.image(0, 0, "detail");
        this.detail.x = this.sceneConfig.sceneWidth / 2;
        this.detail.y = this.sceneConfig.sceneHeight / 2;
        this.detail.setDepth(6);

        // Journal
        this.journal = new NPC(this, "journal", null);
        this.journal.name = "Journal";
        this.journal.setPosition(810, 630);
        this.journal.setScale(0.3);
        this.journal.setDepth(this.journal.y);
        this.interactableList.push(this.journal);

        // Brush patch bottom
        for (var i = 0; i < 30; i++) {
            var brushName = this.brushes[Math.floor(Math.random() * 3)];
            var xPosition = 750 + Math.random() * (2100 - 750);
            var yPosition = 1680 + Math.random() * (2200 - 1680);

            var brush = this.add.image(xPosition, yPosition, brushName);

            brush.setScale(Math.random() * 0.25 + 0.5);
            brush.flipX = Math.random() >= 0.5;
            brush.setDepth(Math.floor(brush.y + brush.scale * 30));
        }

        // Brush top left
        for (var i = 0; i < 10; i++) {
            var brushName = this.brushes[Math.floor(Math.random() * 3)];
            var xPosition = 1000 + Math.random() * (1900 - 1000);
            var yPosition = 650 + Math.random() * (1200 - 650);

            var brush = this.add.image(xPosition, yPosition, brushName);

            brush.setScale(Math.random() * 0.25 + 0.5);
            brush.flipX = Math.random() >= 0.5;
            brush.setDepth(Math.floor(brush.y + brush.scale * 30));
        }

        // Brush top right
        for (var i = 0; i < 10; i++) {
            var brushName = this.brushes[Math.floor(Math.random() * 3)];
            var xPosition = 2300 + Math.random() * (2800 - 2300);
            var yPosition = 150 + Math.random() * (650 - 150);

            var brush = this.add.image(xPosition, yPosition, brushName);

            brush.setScale(Math.random() * 0.25 + 0.5);
            brush.flipX = Math.random() >= 0.5;
            brush.setDepth(Math.floor(brush.y + brush.scale * 30));
        }

        // Fence
        this.fence = new Level(this, "fence", 0);

        // Car
        this.car = new Car(this, shapes.car_body);
        this.interactableList.push(this.car);

        // Player
        this.player = new Player(this, shapes.player_body);

        //Hag - top character
        this.hag = new NPC(this, "hag", shapes.hag_body);
        this.hag.setPosition(1800, 180);
        this.interactableList.push(this.hag);

        // Camera smooth following
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1); //, 0.05, 0.05);
        this.cameras.main.roundPx = false;
        this.cameras.main.setRoundPixels(false);

        // Physics
        this.matter.world.setBounds(0, 0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight);

        // Particle systems
        this.fireflyParticles = this.add.particles("firefly");
        this.fireflyParticles.setDepth(5000);

        var emissionCircle = new Phaser.Geom.Circle(0, 0, 1500);
        var emissionCircle2 = new Phaser.Geom.Circle(0, 0, 300);

        this.fireflyParticles.createEmitter({
            x: this.sceneConfig.sceneWidth / 2,
            y: this.sceneConfig.sceneHeight / 2,
            lifespan: 10000,
            gravityY: 0,
            scale: {
                start: 0,
                end: .5
            },
            blendMode: 'ADD',
            quantity: 1,
            frequency: 50,
            emitZone: {
                type: 'random',
                source: emissionCircle
            },
            maxParticles: 300,
            particleClass: FireflyParticles // custom particle class definition in js/components/fireflyParticles.js
        });

        this.fireflyParticles.createEmitter({
            x: this.sceneConfig.sceneWidth / 2 + 200,
            y: this.sceneConfig.sceneHeight - 800,
            lifespan: 10000,
            gravityY: 0,
            scale: {
                start: 0,
                end: .5
            },
            blendMode: 'ADD',
            quantity: 1,
            frequency: 50,
            emitZone: {
                type: 'random',
                source: emissionCircle2
            },
            maxParticles: 200,
            particleClass: FireflyParticles
        });

        //Collision checkers
        this.matter.world.on('collisionactive', function (event, bodyA, bodyB) {
            if (typeof bodyA.gameObject.handleCollision === 'function') {
                bodyA.gameObject.handleCollision(event.pairs, bodyB);
            }
            if (typeof bodyB.gameObject.handleCollision === 'function') {
                bodyB.gameObject.handleCollision(event.pairs, bodyA);
            }
        });

        this.comicManager.loadJSONComics(this);
        if(debug != true){
            this.comicManager.startComic("Introduction");
        } else {
            //this.overlay.alpha = 1;

            this.tweens.add({
                targets: this.overlay,
                alpha: 0,
                duration: 3000,
                ease: 'Power2',
                onComplete: function(){
                    this.parent.scene.overlay.setVisible(false);
                }
            });
        }

    }

    update(time, delta) {
        //Debug panel
        if (debug == true) {
            if (this.debugPannel == null) {
                this.debugPannel = document.getElementById("debugPannel");
            }

            this.debugPannel.innerHTML = "<b>DEBUG</b> <br>Player X Position: " + Math.round(this.player.x) + "<br>Player Y Position: " + Math.round(this.player.y);

        }

        if (this.comicManager.currentlyInComic != true) {
            this.player.movePlayer(.2 * delta, delta);
        } else {
            this.player.freezePlayer();
        }

        //Change the layer depth of car and player
        /*
        if (this.player.y > this.car.y) {
            this.player.setDepth(2);
            this.car.setDepth(1);
        } else {
            this.player.setDepth(1);
            this.car.setDepth(2);
        }
        */
    }

    onObjectClicked(pointer, gameObject)
    {
        for(var i = 0; i < this.interactableList.length; i++)
        {
         //   console.log(this.interactableList[i]);

            if(gameObject.name == this.interactableList[i].name){
                //console.log("Click " + gameObject.name);
                this.interactableList[i].handleClicked(true);   
            }
            else
            {
           //     console.log(this.interactableList[i].name);
                this.interactableList[i].handleClicked(false);
            }
        }
    }

    handleClick(pointer) {

      if (this.comicManager.currentlyInComic) {
            if (this.comicManager.makingChoice != true) {
                this.comicManager.nextPanel();
            }
            this.player.targetPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
        } else {
            this.player.targetPosition = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
        }
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