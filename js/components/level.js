class Level extends Phaser.GameObjects.Sprite {
    constructor(scene, layer, depth) {

        //npc position on the screen
        var x = 0;
        var y = 0;
       
        //add npc on the screen
        super(scene, x, y, layer);
        scene.add.existing(this);
        
        //set npc properties
        this.setOrigin(0, 0);
        this.setDepth(depth);
    }
}