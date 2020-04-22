class NPC extends Phaser.Physics.Matter.Sprite {
    constructor(scene, npcName, shape) {

        //npc position on the screen
        var x = 1800;
        var y = 190;
       
        //add npc on the screen
        super(scene.matter.world, x, y, npcName);
        scene.add.existing(this);
        
        //set npc properties
        this.setBody(shape);
        this.setScale(0.4, 0.4);
        this.setPosition(x, y);
        //this.setOrigin(0.5, 1);
        this.setDepth(y);
        this.setStatic(true);

        this.name = npcName;
        this.setName(npcName);
    }

    handleEvents()
    {
        this.setInteractive();

        this.on('pointerdown', function(pointer) {
            //console.log("#####(((/((");
         });
    }

    /// Set this.clicked to true or false depending where the player clicked
    /// this lets the player click on the car and just after on the scenario without the 
    /// comic panel open.
    handleClicked(_status)
    {
        this.clicked = _status;
    }
}