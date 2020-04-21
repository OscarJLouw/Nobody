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

        this.scene = scene;

        this.clicked = false;
        this.setInteractive();

        this.on('pointerdownoutside', function(pointer){
            console.log("OUTSIDE");
            this.clicked = false;
        });
        
        this.on('pointerdown', this.handleClick);
    }

    handleCollision(collisionPairs, otherBody)
    {
        if(this.clicked == true && !this.scene.comicManager.currentlyInComic){
            this.scene.comicManager.startComic("Introduction");
            this.clicked = false;
        }
    }

    handleClick(pointer,gameObect){
        if(!this.scene.comicManager.currentlyInComic)
            this.clicked = true;
    }
}