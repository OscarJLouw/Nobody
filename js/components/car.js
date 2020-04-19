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
        this.setDepth(2);
        this.setStatic(true); 
    }
}