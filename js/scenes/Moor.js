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
        this.comicManager = new ComicManager(this);
        // Preload all the comic files
        this.comicManager.loadComics(this);
    }

    // Called when scene is loaded
    create() {
        // Create camera
        this.cameras.main.setBounds(0, 0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight);

        // Physics shapes
        this.shapes = this.cache.json.get('shapes');

        // Set up events
        this.setupEvents();

        // Add the background
        this.background = new Background(this, "background", 0);

        // Add the player
        this.player = new Player(this, this.shapes.player_body);

        // Place the scenery and detail objects
        this.brushes = ["brush1", "brush2", "brush3"];
        this.createScenery();

        // Add Interactables/NPCs
        this.interactableList = [];
        this.createInteractables();

        // Camera smooth following
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1); //, 0.05, 0.05);
        this.cameras.main.roundPx = false;
        this.cameras.main.setRoundPixels(false);

        // Physics
        this.matter.world.setBounds(0, 0, this.sceneConfig.sceneWidth, this.sceneConfig.sceneHeight);

        // Particle systems
        this.createParticles();

        // White overlay for comics
        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0xffffff, 1);
        this.overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.overlay.setScrollFactor(0);
        this.overlay.setDepth(99999);
        this.overlayActive = true;

        // Comic manager
        this.comicManager.loadJSONComics(this);
        if(debug != true){
            this.comicManager.startComic("Introduction");
        } else {
            this.overlayActive = false;

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

        // Comic outcomes
        this.hagSleeping = false;
        this.choseEyes = false;
        this.choseMouth = false;
    }

    setupEvents(){
        // Pointer events
        this.input.on('pointerdown', function (pointer) {
            this.handleClick(pointer);
        }, this);

        this.input.on('pointerup', function (pointer) {
            this.handlePointerUp(pointer);
        }, this);

        this.input.on('gameobjectdown', function(pointer, gameObject) {
            this.onObjectClicked(pointer, gameObject);
        }, this);

        this.input.on('gameobjectover', function(pointer, gameObject) {
            this.onObjectOver(pointer, gameObject);
        }, this);

        this.input.on('gameobjectmove', function(pointer, gameObject) {
            this.onObjectOver(pointer, gameObject);
        }, this);

        this.input.on('gameobjectout', function(pointer, gameObject) {
            this.onObjectOut(pointer, gameObject);
        }, this);

        //Collision checkers
        this.matter.world.on('collisionactive', function (event, bodyA, bodyB) {
            if (typeof bodyA.gameObject.handleCollision === 'function') {
                bodyA.gameObject.handleCollision(event.pairs, bodyB);
            }
            if (typeof bodyB.gameObject.handleCollision === 'function') {
                bodyB.gameObject.handleCollision(event.pairs, bodyA);
            }
        });
    }

    createScenery(){
        // Bushes overlay
        this.bushes = new PhysicsProp(this, "bushes", this.shapes.bush_body);
        this.bushes.setOrigin(this.bushes.centerOfMass.x, this.bushes.centerOfMass.y);
        this.bushes.moveToPosition(
            this.sceneConfig.sceneWidth / 2 + ((this.bushes.centerOfMass.x-0.5) * this.bushes.displayWidth),
            this.sceneConfig.sceneHeight / 2 + ((this.bushes.centerOfMass.y-0.5) * this.bushes.displayHeight));

        this.bushes.setDepth(5000);

        // Detail objects
        this.detail1 = new PhysicsProp(this, "detail1", this.shapes.detail1);
        this.detail1.moveToPosition(2530,1940);
        this.detail1.setScale(0.4);

        this.detail2 = new PhysicsProp(this, "detail2", this.shapes.detail2);
        this.detail2.moveToPosition(1100,1640);
        this.detail2.setScale(0.4);
        
        this.detail3 = new PhysicsProp(this, "detail3", this.shapes.detail3);
        this.detail3.moveToPosition(540,1720);
        this.detail3.setScale(0.4);
        
        this.detail4 = new PhysicsProp(this, "detail4", this.shapes.detail4);
        this.detail4.moveToPosition(530,1160);
        this.detail4.setScale(0.4);
        
        this.detail5 = new PhysicsProp(this, "detail5", this.shapes.detail5);
        this.detail5.moveToPosition(500,500);
        this.detail5.setScale(0.4);
        
        this.detail6 = new PhysicsProp(this, "detail6", this.shapes.detail6);
        this.detail6.moveToPosition(3080,560);
        this.detail6.setScale(0.4);
        
        this.detail7 = new PhysicsProp(this, "detail7", this.shapes.detail7);
        this.detail7.moveToPosition(3180,660);
        this.detail7.setScale(0.4);

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
        this.fence = new PhysicsProp(this, "fence", this.shapes.fence_body);
        this.fence.moveToPosition(this.sceneConfig.sceneWidth / 2 + ((this.fence.centerOfMass.x-0.5) * this.fence.displayWidth), 50);
    }

    createInteractables(){
        // Car
        this.car = new Interactable(this, "car", this.shapes.car_body);
        this.car.moveToPosition(2700, 1000);
        this.car.setScale(0.4);

        // Hag (awake)
        this.hag = new Interactable(this, "hag", this.shapes.hag_awake);
        this.hag.moveToPosition(1800, 180);
        this.hag.setScale(0.4);
        this.hag.setComic("Hag_FirstMeeting");

        // Journal
        this.journal = new Interactable(this, "journal", null);
        this.journal.moveToPosition(600, 740);
        this.journal.setScale(0.3);
    }

    createParticles(){
        this.fireflyParticles = this.add.particles("firefly");
        this.fireflyParticles.setDepth(5000);

        // Emission shapes
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
    }

    update(time, delta) {
        //Debug panel
        if (debug == true) {
            if (this.debugPannel == null) {
                this.debugPannel = document.getElementById("debugPannel");
            }

            this.debugPannel.innerHTML = "<b>DEBUG</b> <br>Player X Position: " + Math.round(this.player.x) + "<br>Player Y Position: " + Math.round(this.player.y);
        }

        // Comic manager freezes the player when in a comic
        if (this.comicManager.currentlyInComic != true) {
            this.player.movePlayer(.2 * delta, delta);
        } else {
            this.player.freezePlayer();
        }
    }

    handleOutcomes(outcomes){
        for(var i = 0; i<outcomes.length; i++){
            switch(outcomes[i]){
                case "hagSleeping":
                    this.sleepHag();
                    break;
                case "choseEyes":
                    this.updateBody("eyes");
                    break;
                case "choseMouth":
                    this.updateBody("mouth");
                    break;
            }
        }
    }

    sleepHag(){
        // put the hag to sleep
        this.hag.removeInteractable();

        this.hag = new Interactable(this, "hagSleeping", this.shapes.hag_sleeping);
        this.hag.moveToPosition(2000, 200);
        this.hag.setScale(0.4);

        // TODO: Add the sleeping hag comic!
        this.hag.setComic("none");
    }

    updateBody(newPart){
        if(newPart == "eyes"){
            // change the player sprite to add eyes
        } else if(newPart == "mouth"){
            // change the player sprite to add mouth
        }
    }

    onObjectClicked(pointer, gameObject)
    {
        for(var i = 0; i < this.interactableList.length; i++)
        {
            if(gameObject.name == this.interactableList[i].name){
                this.interactableList[i].handleClicked(true);   
            }
            else
            {
                this.interactableList[i].handleClicked(false);
            }
        }
    }

    onObjectOver(pointer, gameObject){
        if(!this.overlayActive){
            if(gameObject != null && gameObject.isInteractable == true){
                this.input.setDefaultCursor('url(../../img/cursorHover.cur), pointer');
            }
        }
    }

    onObjectOut(pointer, gameObject){
        this.input.setDefaultCursor('url(../../img/cursor.cur), pointer');
    }

    handleClick(pointer) {
        this.input.setDefaultCursor('url(../../img/cursorClick.cur), pointer');

      if (this.comicManager.currentlyInComic) {
            if (this.comicManager.makingChoice != true) {
                this.comicManager.nextPanel();
            }
            this.player.targetPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
        } else {
            this.player.targetPosition = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
        }
    }

    handlePointerUp(pointer) {
        this.input.setDefaultCursor('url(../../img/cursor.cur), pointer');
    }

    fadeInOverlay(fadeTime = 1000){
        this.input.setDefaultCursor('url(../../img/cursor.cur), pointer');
        this.overlayActive = true;
        this.overlay.setVisible(true);
        this.tweens.add({
            targets: this.overlay,
            alpha: 0.8,
            duration: fadeTime,
            ease: 'Power2'
        });
    }

    fadeOutOverlay(fadeTime = 1000){
        this.overlayActive = false;
        this.tweens.add({
            targets: this.overlay,
            alpha: 0,
            duration: fadeTime,
            ease: 'Power2',
            onComplete: function(){
                this.parent.scene.overlay.setVisible(false);
                this.parent.scene.comicManager.ableToStartComic = true;
            }
        });
    }
}