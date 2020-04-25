class BootGame extends Phaser.Scene {
    constructor()
    {
        // the "super" function makes this class inherit all characteristics of predecessor (the Phaser "Scene" class definition)
        super("bootGame");
    }

    // preload loads all assets before scene starts
    preload(){
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0xe4a2cc, 0.2);
        progressBox.fillRect(this.cameras.main.width / 2 - 320 / 2, this.cameras.main.height / 2, 320, 5);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var xPosition = this.cameras.main.width / 2;
        var yPosition = this.cameras.main.height / 2;

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 20,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#662b50'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 20,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#662b50'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0x662b50, 1);
            progressBar.fillRect(xPosition - 320 / 2, yPosition, 300 * value, 5);
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            percentText.destroy();
        });

        /** PLAYER **/
        this.load.spritesheet("player", "../../img/player/Animation/PlayerAnimation.png", {
            frameWidth: 256,
            frameHeight: 256
        });

        this.load.animation("playerAnimations", "../../img/player/Animation/PlayerAnimation.json");

        // Particles
        this.load.image("firefly", "../../img/firefly.png");

        // Load Physics body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', '../../physics/physics-shapes.json');

        /** MOOR IMAGES **/
        this.load.setBaseURL("../../img/Moor");
        // backgrounds
        this.load.image("background", "Backgrounds/moor_tiny.jpg");
        this.load.image("bushes", "Backgrounds/moor_bush_small.png");
        // props
        this.load.image("fence", "Props/fence.png");
        this.load.image("brush1", "Props/brush1.png");
        this.load.image("brush2", "Props/brush2.png");
        this.load.image("brush3", "Props/brush3.png");
        this.load.image("detail1", "Props/detail1.png");
        this.load.image("detail2", "Props/detail2.png");
        this.load.image("detail3", "Props/detail3.png");
        this.load.image("detail4", "Props/detail4.png");
        this.load.image("detail5", "Props/detail5.png");
        this.load.image("detail6", "Props/detail6.png");
        this.load.image("detail7", "Props/detail7.png");
        // interactables
        this.load.image("car", "Interactables/car.png");
        this.load.image("hag", "Interactables/hag.png");
        this.load.image("hagSleeping", "Interactables/hag_sleeping.png");
        this.load.image("journal", "Interactables/journal.png");
    }

    // create is called when scene is loaded
    create(){
        this.scale.on('resize', Resize, this);
        this.add.text(20,20,"Loading game...");

        this.input.setDefaultCursor('url(../../img/cursor.cur), pointer');
        this.input.setPollAlways();
        
        // Load the first level
        this.scene.start("MoorLevel");
    }
}

// Resize game window with browser
function Resize (gameSize, baseSize, displaySize, resolution)
{
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);

    // Should manually reposition/scale all the elements here?
}