class ComicManager {
    constructor(scene) {
        this.scene = scene;
        this.visiblePannels = [];
        this.currentlyInComic = false;
        this.makingChoice = false;
    }

    loadComics(scene) {
        // Intro pannels
        scene.load.image("testPanel1", "../../img/Comics/Intro/testpanel1.png");
        scene.load.image("testPanel2", "../../img/Comics/Intro/testpanel2.png");
        scene.load.image("testPanel3", "../../img/Comics/Intro/testpanel3.png");
        scene.load.image("testPanel4", "../../img/Comics/Intro/testpanel4.png");
        scene.load.image("testPanel5", "../../img/Comics/Intro/testpanel5.png");

        // Hag pannels
        scene.load.image("Hag1", "../../img/Comics/Hag/Hag1.png");
        scene.load.image("Hag2", "../../img/Comics/Hag/Hag2.png");
        scene.load.image("Hag3", "../../img/Comics/Hag/Hag3.png");
        // choice 1
        scene.load.image("Hag_C1", "../../img/Comics/Hag/HagChoice1.png");
        scene.load.image("Hag_C1_1", "../../img/Comics/Hag/HagChoice1_1.png");
        scene.load.image("Hag_C1_2", "../../img/Comics/Hag/HagChoice1_2.png");
        scene.load.image("Hag_C1_3", "../../img/Comics/Hag/HagChoice1_3_withoutmouth.png");
        scene.load.image("Hag_C1_4", "../../img/Comics/Hag/HagChoice1_3.png");
        scene.load.image("Hag_C1_5", "../../img/Comics/Hag/HagChoice1_4.png");
        // choice 2
        scene.load.image("Hag_C2", "../../img/Comics/Hag/HagChoice2.png");
        scene.load.image("Hag_C2_1", "../../img/Comics/Hag/HagChoice2_1.png");
        scene.load.image("Hag_C2_2", "../../img/Comics/Hag/HagChoice2_2.png");
        scene.load.image("Hag_C2_3", "../../img/Comics/Hag/HagChoice2_3_withouteyes.png");
        scene.load.image("Hag_C2_4", "../../img/Comics/Hag/HagChoice2_3.png");
        scene.load.image("Hag_C2_5", "../../img/Comics/Hag/HagChoice2_4.png");
        scene.load.image("Hag_C2_6", "../../img/Comics/Hag/HagChoice2_5.png");


        // JSON Page Lists
        scene.load.json('introPages', '../../json/introPages.json');
        scene.load.json('hagPages', '../../json/hagPages.json');

        // JSON Comic List
        scene.load.json('comicList', '../../json/comic.json');
    }

    loadJSONComics(scene) {
        this.comicList = scene.cache.json.get('comicList').comicList;
        var introPages =  scene.cache.json.get('introPages').pageList;
        var hagPages =  scene.cache.json.get('hagPages').pageList;

        this.pageList = [];
        this.pageList = this.pageList.concat(introPages);
        this.pageList = this.pageList.concat(hagPages);
    }

    startComic(comicName) {
        this.currentlyInComic = true;

        this.currentComic = this.comicList.find(x => x.comicName === comicName);
        this.currentPageIndex = 0;
        this.comicPageIndex = 0;
        this.currentPage = this.pageList.find(x => x.pageName === this.currentComic.pages[0].name);
        this.currentPannelIndex = 0;

        this.scene.overlay.setVisible(true);
        if(comicName != "Introduction"){
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

        return pannel;
    }

    nextPannel() {
        this.currentPannelIndex++;
        
        var pannel = this.currentPage.pannels[this.currentPannelIndex];

        if (pannel != null) {
            if(pannel.choiceID != null){
                // this is a choice
                var i = this.currentPannelIndex;
                var choicePannels = [];
                while(this.currentPage.pannels[i] != null && this.currentPage.pannels[i].choiceID != null){
                    choicePannels.push(this.currentPage.pannels[i]);
                    i++;
                }

                this.drawChoices(choicePannels);
            } else {
                this.drawPannel(pannel);
            }
            return false;
        } else {
            for (var i = 0; i < this.visiblePannels.length; i++) {
                this.visiblePannels[i].destroy();
            }

            this.currentPannelIndex = 0;

            return this.nextPage();
        }
    }

    drawChoices(choicePannels){
        this.makingChoice = true;
        
        //var choices = this.currentComic.pages[this.currentPageIndex].choices;
        
        var currentChoicesAvailable = [];
        for(var i = 0; i<this.currentComic.pages.length; i++){
            if(this.currentComic.pages[i].next == "choice"){
                currentChoicesAvailable = currentChoicesAvailable.concat(this.currentComic.pages[i].choices);
            }
        }
        
        // draw pannels and handle choice selection
        for(var i = 0; i<choicePannels.length; i++){
            var pannel = this.drawPannel(choicePannels[i]);
            
            var next = currentChoicesAvailable.find(x => x.choiceID == choicePannels[i].choiceID).next;
            pannel.setInteractive({pixelPerfect: true});
            pannel.next = next;

            pannel.on("pointerdown", function(){
                this.input.gameObject.scene.comicManager.nextPage(this.input.gameObject.next);
            });
        }

    }

    nextPage(next = "null") {
        if(next !="null"){
            // this pannel was clicked
            for (var i = 0; i < this.visiblePannels.length; i++) {
                this.visiblePannels[i].destroy();
            }

            this.currentPannelIndex = 0;
            this.makingChoice = false;

            // if the next comic is set in the function call
            // find the page in the pageList which corresponds to the "next" value that was passed in
            this.currentPage = this.pageList.find(x => x.pageName === next);
            this.comicPageIndex = this.currentComic.pages.findIndex(x => x.name === this.currentPage.pageName);
            //this.currentPageIndex = this.pageList.findIndex(x => x.pageName === next);
            this.drawPannel(this.currentPage.pannels[this.currentPannelIndex]);

            return false;
        } else {
            if (this.currentComic.pages[this.comicPageIndex].next == "none") {
                // Comic is finished
                this.currentlyInComic = false;

                if (this.currentComic.comicName != "Introduction") {
                    this.scene.tweens.add({
                        targets: this.scene.overlay,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: function(){
                            this.parent.scene.overlay.setVisible(false);
                        }
                    });
                } else {
                    this.scene.tweens.add({
                        targets: this.scene.overlay,
                        alpha: 0,
                        duration: 3000,
                        ease: 'Power2',
                        onComplete: function(){
                            this.parent.scene.overlay.setVisible(false);
                        }
                    });
                }

                return true;
            } else {
                // find the page in the pageList which corresponds to this current page's "next" value
                this.currentPage = this.pageList.find(x => x.pageName === this.currentComic.pages[this.comicPageIndex].next);
                //this.currentPageIndex = this.pageList.findIndex(x => x.pageName === this.currentComic.pages[this.comicPageIndex].next);
                
                // Update the index of the page relative to the current comic page list loaded
                this.comicPageIndex = this.currentComic.pages.findIndex(x => x.name === this.currentPage.pageName);

                this.drawPannel(this.currentPage.pannels[this.currentPannelIndex]);

                return false;
            }
        }
    }
}