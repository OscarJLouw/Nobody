class NPC extends Phaser.Physics.Matter.Sprite {
    constructor(scene, npcName, shape) {

        //npc position on the screen
        var x = 0;
        var y = 0;
       
        //add npc on the screen
        super(scene.matter.world, x, y, npcName);
        scene.add.existing(this);
        
        //set npc properties
        this.setBody(shape);
        this.setPosition(200, 200);
        this.setOrigin(0.5, 1);
        this.setDepth(1);
        this.targetPosition = new Phaser.Math.Vector2(200, 200);
    }
}