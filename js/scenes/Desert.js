class Desert extends Phaser.Scene {

    constructor ()
    {
        super({ 
            key: 'Desert', 
            active: false,
            visible: false,
             
        });
    }

    create ()
    {
        let graphics = this.add.graphics();

        graphics.fillStyle(0xffcc33, 1);

        graphics.fillRect(100, 200, 600, 300);
        graphics.fillRect(300, 100, 100, 100);

        this.add.text(320, 110, 'D', { font: '96px Courier', fill: '#000000' });
    }
}