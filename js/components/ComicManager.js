class ComicManager {
    constructor(scene) {
        this.scene = scene;
        this.visiblePannels = [];
        this.currentlyInComic = false;
    }

    loadComics(scene) {
        scene.load.image("testPanel1", "../../img/Comics/Intro/testpanel1.png");
        scene.load.image("testPanel2", "../../img/Comics/Intro/testpanel2.png");
        scene.load.image("testPanel3", "../../img/Comics/Intro/testpanel3.png");
        scene.load.image("testPanel4", "../../img/Comics/Intro/testpanel4.png");
        scene.load.image("testPanel5", "../../img/Comics/Intro/testpanel5.png");
        scene.load.json('pageList', '../../json/intro.json');
        scene.load.json('comicList', '../../json/comic.json');
    }

    loadJSONComics(scene) {
        this.comicList = scene.cache.json.get('comicList').comicList;
        this.pageList = scene.cache.json.get('pageList').pageList;
    }

    startComic(comicName) {

        this.currentlyInComic = true;

        this.currentComic = this.comicList.find(x => x.comicName === comicName);
        this.currentPageIndex = 0;
        this.currentPage = this.pageList.find(x => x.pageName === this.currentComic.pages[0].name);
        this.currentPannelIndex = 0;

        if (comicName != "Introduction") {
            this.scene.tweens.add({
                targets: this.scene.overlay,
                alpha: 0.8,
                duration: 1000,
                ease: 'Power2'
            });
        }

        this.drawPannel(this.currentPage.pannels[this.currentPannelIndex]);
    }

    drawPannel(pannelObject) {
        var pannel = this.scene.add.image(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, pannelObject.name);

        var aspectRatio = pannel.displayWidth / pannel.displayHeight;
        pannel.displayHeight = this.scene.cameras.main.displayHeight;
        pannel.displayWidth = pannel.displayHeight * aspectRatio;

        pannel.setDepth(99999);
        pannel.setScrollFactor(0);

        this.visiblePannels.push(pannel);

        if (pannelObject.animation == "fade") {
            pannel.setAlpha(0);
            this.scene.tweens.add({
                targets: pannel,
                alpha: 1,
                duration: 1000,
                ease: 'Power2'
            });
        } else if (pannelObject.animation == "slide") {
            switch (pannelObject.direction) {
                case "up":
                    pannel.y = this.scene.cameras.main.displayHeight * 2;
                    break;
                case "down":
                    pannel.y = -this.scene.cameras.main.displayHeight * 2;
                    break;
                case "left":
                    pannel.x = this.scene.cameras.main.displayWidth * 2;
                    break;
                case "right":
                    pannel.x = -this.scene.cameras.main.displayWidth * 2;
                    break;
            }

            this.scene.tweens.add({
                targets: pannel,
                x: this.scene.cameras.main.centerX,
                y: this.scene.cameras.main.centerY,
                duration: 1500,
                ease: 'Power2'
            });

        }

    }

    nextPannel() {
        this.currentPannelIndex++;

        if (this.currentPage.pannels[this.currentPannelIndex] != null) {
            this.drawPannel(this.currentPage.pannels[this.currentPannelIndex]);

            return false;
        } else {
            for (var i = 0; i < this.visiblePannels.length; i++) {
                this.visiblePannels[i].destroy();
            }

            this.currentPannelIndex = 0;

            return this.nextPage();
        }
    }

    nextPage() {

        if (this.currentComic.pages[this.currentPageIndex].next == "none") {
            // Comic is finished
            this.currentlyInComic = false;

            if (this.currentComic.comicName != "Introduction") {
                this.scene.tweens.add({
                    targets: this.scene.overlay,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power2'
                });
            } else {
                this.scene.tweens.add({
                    targets: this.scene.overlay,
                    alpha: 0,
                    duration: 3000,
                    ease: 'Power2'
                });
            }

            return true;
        } else {
            this.currentPage = this.pageList.find(x => x.pageName === this.currentComic.pages[this.currentPageIndex].next);
            this.currentPageIndex = this.pageList.findIndex(x => x.pageName === this.currentComic.pages[this.currentPageIndex].next);
            this.drawPannel(this.currentPage.pannels[this.currentPannelIndex]);

            return false;
        }
    }
}