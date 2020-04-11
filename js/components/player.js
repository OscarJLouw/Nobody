class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, shape) {

        //player position on the screen
        var x = 0;
        var y = 0;
       
        //add player on the screen
        super(scene.matter.world, x, y, "car");
        scene.add.existing(this);
        
        //set player properties
        this.setBody(shape);
        this.setScale(0.4, 0.4);
        this.setPosition(200, 200);
        this.setOrigin(0.5, 1);
        this.setDepth(1);
        this.setStatic(true); 
        this.targetPosition = new Phaser.Math.Vector2(200, 200);
    }
}