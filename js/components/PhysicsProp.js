class PhysicsProp extends Phaser.Physics.Matter.Sprite {
    constructor(scene, spriteName, physicsBodyName) {
        super(scene.matter.world, 0, 0, spriteName);
        scene.add.existing(this);
        
        this.scene = scene;

        this.setBody(physicsBodyName);
        this.setStatic(true);

        this.name = spriteName;
        this.setName(spriteName);
    }

    moveToPosition(x, y){
        this.setPosition(x, y);
        this.setDepth(y);
    }

    handleClicked(_status) {
        this.clicked = _status;
    }
}