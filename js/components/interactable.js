class Interactable extends Phaser.Physics.Matter.Sprite {
    constructor(scene, spriteName, physicsBodyName) {
        super(scene.matter.world, 0, 0, spriteName);
        scene.add.existing(this);
        
        this.scene = scene;

        this.setBody(physicsBodyName);
        this.setStatic(true);

        this.name = spriteName;
        this.setName(spriteName);
        this.comicName = "none";

        this.setInteractive({pixelPerfect: true});
        this.isInteractable = true;

        scene.interactableList.push(this);

        this.on('pointerdown', this.handleClick);
    }

    moveToPosition(x, y){
        this.setPosition(x, y);
        this.setDepth(y);
    }

    setComic(comicName){
        this.comicName = comicName;
    }

    handleCollision(collisionPairs, otherBody)
    {
        if(this.clicked == true && !this.scene.comicManager.currentlyInComic){
            if(this.comicName != "none"){
                this.scene.comicManager.startComic(this.comicName);
            }
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
    
    removeInteractable(){
        var name = this.name;
        this.scene.interactableList = this.scene.interactableList.filter(function(element) { return element.name != name; }); 
        this.scene.matter.world.remove(this);
        this.destroy();
    }
}