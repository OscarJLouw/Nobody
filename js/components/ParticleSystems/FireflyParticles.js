class FireflyParticles extends Phaser.GameObjects.Particles.Particle {
    constructor (emitter) {
        super(emitter);
        /* ... */
    }

    update (delta, step, processors) {
        super.update(delta, step, processors);
        //max(0, min(new_index, len(mylist)-1))

        this.velocityX += Math.random() * 10 - 5;
        this.velocityY += Math.random() * 10 - 5;

        this.velocityX = Math.max(-40,Math.min(this.velocityX, 40));
        this.velocityY = Math.max(-20,Math.min(this.velocityY, 20));

        this.scaleX = this.scaleY = Math.sin(this.lifeT * Math.PI)* 0.4;
    }
}