class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, shape) {

        //player position on the screen
        var x = 1860;
        var y = 1340;
       
        //add player on the screen
        super(scene.matter.world, x, y, "player");
        scene.add.existing(this);
        
        //set player properties
        this.setBody(shape);
        this.setPosition(x, y);
        this.setOrigin(0.5, 1);
        this.setDepth(1);
        this.targetPosition = new Phaser.Math.Vector2(x, y);
    }

    handleCollision()
    {
       this.on('collisionstart', function (event, bodyA, bodyB) {
            console.log('collision');
        });
    }
    
    movePlayer(moveSpeed) {
        var currentPosition = new Phaser.Math.Vector2(this.x, this.y);
        var moveDirection = new Phaser.Math.Vector2(currentPosition.x, currentPosition.y);

        moveDirection.subtract(this.targetPosition);
        var length = moveDirection.length();

        if (length > moveSpeed) {
            moveDirection.normalize();
            moveDirection.scale(moveSpeed);
        }

        if (length < 0.2) {
            // idle
            this.setFrame(1);
        } else {
            if (Math.abs(moveDirection.x) > Math.abs(moveDirection.y)) {
                if (moveDirection.x < 0) {
                    // right
                    this.setFrame(3);
                } else if (moveDirection.x > 0) {
                    // left
                    this.setFrame(2);
                }
            } else {
                if (moveDirection.y < 0) {
                    // down
                    this.setFrame(1);
                } else if (moveDirection.y > 0) {
                    // up
                    this.setFrame(0);
                }
            }
        }

        //console.log(-moveDirection.x + " ### " + -moveDirection.y);
        //var newPosition = currentPosition.subtract(moveDirection);
        this.setVelocity(-moveDirection.x, -moveDirection.y);
        this.setAngle(0);
    }
}