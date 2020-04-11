class NPC extends Phaser.Physics.Matter.Sprite {
    constructor(scene, npcName, shape) {

        //npc position on the screen
        var x = 1800;
        var y = 290;
       
        //add npc on the screen
        super(scene.matter.world, x, y, npcName);
        scene.add.existing(this);
        
        //set npc properties
        this.setBody(shape);
        this.setScale(0.4, 0.4);
        this.setPosition(x, y);
        this.setOrigin(0.5, 1);
        this.setDepth(1);
        this.setStatic(true);
        this.targetPosition = new Phaser.Math.Vector2(200, 200);
    }
}