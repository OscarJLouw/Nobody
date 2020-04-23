class Car extends Phaser.Physics.Matter.Sprite {
    constructor(scene, shape) {

        //car position on the screen
        var x = 2700;
        var y = 1000;
       
        //add car on the screen
        super(scene.matter.world, x, y, "car");
        scene.add.existing(this);
        
        //set car properties
        this.setBody(shape);
        this.setScale(0.4, 0.4);
        this.setOrigin(0.49, 0.62);
        this.setDepth(y);
        this.setStatic(true); 

        this.name = "Car";
        this.setName("Car");

        this.scene = scene;

        this.clicked = false;
        this.setInteractive({ cursor: 'url(../../img/cursorHover.cur), pointer', pixelPerfect: true});

        this.on('pointerdownoutside', function(pointer){
            console.log("OUTSIDE");
            this.clicked = false;
        });
        
        this.on('pointerdown', this.handleClick);
    }

    handleCollision(collisionPairs, otherBody)
    {
        if(this.clicked == true && !this.scene.comicManager.currentlyInComic){
            this.scene.comicManager.startComic("Hag_FirstMeeting");
            this.clicked = false;
        }
    }

    handleClick(pointer, gameObect){
        if(!this.scene.comicManager.currentlyInComic)
            this.clicked = true;
    }

    /// Set this.clicked to true or false depending where the player clicked
    /// this lets the player click on the car and just after on the scenario without the 
    /// comic panel open.
    handleClicked(_status)
    {
        this.clicked = _status;
    }
}