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
        this.setDepth(y);
        this.setScale(0.5);
        
        this.targetPosition = new Phaser.Math.Vector2(x, y);

        this.separationPenetration = null;

        this.animationFrameRate = 100; // miliseconds
        this.animationTimer = 0;
        this.currentFrame = 0;
        this.idleFrames = [7,12,4]; //forward, right, back
        this.walkSideFrames = [17,8,9,13,18];
        this.walkForwardFrames = [6,11,16,2,3];
        this.walkBackwardFrames = [0,5,10,15,1];

        this.lastWalkDirection = "Down";
        this.idle = true;
    }

    handleCollision(collisionPairs, otherBody)
    {
        var collision = collisionPairs[0].collision;
        this.separationPenetration = collision.penetration;
        
        if(collision.bodyA.id == "51"){
            this.separationPenetration.x = -collision.penetration.x;
            this.separationPenetration.y = -collision.penetration.y;
        }
    }
    
    movePlayer(moveSpeed, deltaTime) {
        var currentPosition = new Phaser.Math.Vector2(this.x, this.y);
        var moveDirection = new Phaser.Math.Vector2(currentPosition.x, currentPosition.y);

        moveDirection.subtract(this.targetPosition);
        var length = moveDirection.length();

        if (length > moveSpeed) {
            moveDirection.normalize();
            moveDirection.scale(moveSpeed);
        }
        
        var updateFrame = false;

        if (length < 1) {
            // idle
            this.idle = true;

            if(this.lastWalkDirection == "Down") {
                this.setFrame(this.idleFrames[0]);
            } else if(this.lastWalkDirection == "Up") {
                this.setFrame(this.idleFrames[2]);
            } else if(this.lastWalkDirection == "Left") {
                this.setFrame(this.idleFrames[1]);
            } else if(this.lastWalkDirection == "Right") {
                this.setFrame(this.idleFrames[1]);
            }
        } else {
            if(this.idle == true){
                this.idle = false;
                updateFrame = true;
                this.animationTimer = 0;    
            } else {
                this.animationTimer += deltaTime;
                if(this.animationTimer > this.animationFrameRate){
                    this.animationTimer -= this.animationFrameRate;
                    updateFrame = true;
                }
            }

            if (Math.abs(moveDirection.x) > Math.abs(moveDirection.y)) {
                this.animationFrameRate = 80;

                if(updateFrame){
                    var currentFrameIndex = this.walkSideFrames.indexOf(this.currentFrame);
                    if(currentFrameIndex != -1){
                        currentFrameIndex ++;
                        if(currentFrameIndex >= this.walkSideFrames.length)
                            currentFrameIndex = 0;

                        this.currentFrame = this.walkSideFrames[currentFrameIndex];

                    } else {
                        this.currentFrame = this.walkSideFrames[0];
                    }
                }

                if (moveDirection.x < 0) {
                    // right
                    this.lastWalkDirection = "Right";
                    this.flipX = false;
                } else if (moveDirection.x > 0) {
                    // left
                    this.lastWalkDirection = "Left";
                    this.flipX = true;
                }
            } else {
                this.animationFrameRate = 160;
                if (moveDirection.y < 0) {
                    // down
                    this.lastWalkDirection = "Down";

                    if(updateFrame){
                        var currentFrameIndex = this.walkForwardFrames.indexOf(this.currentFrame);
                        if(currentFrameIndex != -1){
                            currentFrameIndex ++;
                            if(currentFrameIndex >= this.walkForwardFrames.length)
                                currentFrameIndex = 0;
    
                            this.currentFrame = this.walkForwardFrames[currentFrameIndex];
                        } else {
                            this.currentFrame = this.walkForwardFrames[0];
                        }
                    }
                } else if (moveDirection.y > 0) {
                    // up
                    this.lastWalkDirection = "Up";

                    if(updateFrame){
                        var currentFrameIndex = this.walkBackwardFrames.indexOf(this.currentFrame);
                        if(currentFrameIndex != -1){
                            currentFrameIndex ++;
                            if(currentFrameIndex >= this.walkBackwardFrames.length)
                                currentFrameIndex = 0;
    
                            this.currentFrame = this.walkBackwardFrames[currentFrameIndex];
                        } else {
                            this.currentFrame = this.walkBackwardFrames[0];
                        }
                    }
                }
            }
            this.setFrame(this.currentFrame);
        }

        //console.log(-moveDirection.x + " ### " + -moveDirection.y);
        //var newPosition = currentPosition.subtract(moveDirection);

        if(this.separationPenetration != null){
            moveDirection.add(this.separationPenetration);

            this.separationPenetration = null;
        }

        this.setVelocity(-moveDirection.x, -moveDirection.y);
        this.setAngle(0);

        this.setDepth(Math.floor(this.y));
    }

    freezePlayer(){
        this.setVelocity(0, 0);
        this.setAngle(0);
        this.idle = true;

        if(this.lastWalkDirection == "Down") {
            this.setFrame(this.idleFrames[0]);
        } else if(this.lastWalkDirection == "Up") {
            this.setFrame(this.idleFrames[2]);
        } else if(this.lastWalkDirection == "Left") {
            this.setFrame(this.idleFrames[1]);
        } else if(this.lastWalkDirection == "Right") {
            this.setFrame(this.idleFrames[1]);
        }
    }
}