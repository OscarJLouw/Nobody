class ComicManager {
    constructor(scene) {
        this.scene = scene;
        this.visiblePanels = [];
        this.currentlyInComic = false;
        this.makingChoice = false;
        this.ableToInteract = true;
        this.ableToStartComic = true;

        var xPosition = this.scene.cameras.main.width/2;
        var yPosition = this.scene.cameras.main.height - 30;
        this.choiceText = this.scene.make.text({
            x: xPosition,
            y: yPosition,
            text: 'Choose one',
            style: {
                font: '22px monospace',
                fill: '#000000'
            }
        });
        this.choiceText.setOrigin(0.5, 1);
        this.choiceText.setDepth(999999);
        this.choiceText.setScrollFactor(0);
        this.choiceText.setAlpha(0);
    }

    loadComics(scene) {
        scene.load.setBaseURL("../../img/Comics");

        // Intro panels
        scene.load.image("testPanel1", "Intro/testpanel1.png");
        scene.load.image("testPanel2", "Intro/testpanel2.png");
        scene.load.image("testPanel3", "Intro/testpanel3.png");
        scene.load.image("testPanel4", "Intro/testpanel4.png");
        scene.load.image("testPanel5", "Intro/testpanel5.png");

        // Hag panels
        scene.load.image("Hag1", "Hag/Hag1.png");
        scene.load.image("Hag2", "Hag/Hag2.png");
        scene.load.image("Hag3", "Hag/Hag3.png");
        // choice 1
        scene.load.image("Hag_C1", "Hag/HagChoice1.png");
        scene.load.image("Hag_C1_1", "Hag/HagChoice1_1.png");
        scene.load.image("Hag_C1_2", "Hag/HagChoice1_2.png");
        scene.load.image("Hag_C1_3", "Hag/HagChoice1_3_withoutmouth.png");
        scene.load.image("Hag_C1_4", "Hag/HagChoice1_3.png");
        scene.load.image("Hag_C1_5", "Hag/HagChoice1_4.png");
        // choice 2
        scene.load.image("Hag_C2", "Hag/HagChoice2.png");
        scene.load.image("Hag_C2_1", "Hag/HagChoice2_1.png");
        scene.load.image("Hag_C2_2", "Hag/HagChoice2_2.png");
        scene.load.image("Hag_C2_3", "Hag/HagChoice2_3_withouteyes.png");
        scene.load.image("Hag_C2_4", "Hag/HagChoice2_3.png");
        scene.load.image("Hag_C2_5", "Hag/HagChoice2_4.png");
        scene.load.image("Hag_C2_6", "Hag/HagChoice2_5.png");
        // final
        scene.load.image("Hag_Sleeping", "Hag/Hag_Sleeping.png");

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
        if(this.ableToStartComic){
            this.ableToStartComic = false;

            this.currentlyInComic = true;

            this.currentComic = this.comicList.find(x => x.comicName === comicName);
            this.currentPageIndex = 0;
            this.comicPageIndex = 0;
            this.currentPage = this.pageList.find(x => x.pageName === this.currentComic.pages[0].name);
            this.currentPanelIndex = 0;
            
            if(comicName != "Introduction"){
                this.scene.fadeInOverlay();
            }

            this.drawPanel(this.currentPage.panels[this.currentPanelIndex]);
        }
    }

    drawPanel(panelObject) {
        this.ableToInteract = false;
        
        var panel = this.scene.add.image(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, panelObject.name);

        var aspectRatio = panel.displayWidth / panel.displayHeight;
        panel.displayHeight = this.scene.cameras.main.displayHeight;
        panel.displayWidth = panel.displayHeight * aspectRatio;

        panel.setDepth(99999);
        panel.setScrollFactor(0);


        if (panelObject.animation == "fade") {
            panel.setAlpha(0);
            this.scene.tweens.add({
                targets: panel,
                alpha: 1,
                duration: 1000,
                ease: 'Power2',
                onComplete: function(){
                    this.parent.scene.comicManager.ableToInteract = true;
                }
            });
        } else if (panelObject.animation == "slide") {
            switch (panelObject.direction) {
                case "up":
                    panel.y = this.scene.cameras.main.displayHeight * 2;
                    break;
                case "down":
                    panel.y = -this.scene.cameras.main.displayHeight * 2;
                    break;
                case "left":
                    panel.x = this.scene.cameras.main.displayWidth * 2;
                    break;
                case "right":
                    panel.x = -this.scene.cameras.main.displayWidth * 2;
                    break;
            }

            this.scene.tweens.add({
                targets: panel,
                x: this.scene.cameras.main.centerX,
                y: this.scene.cameras.main.centerY,
                duration: 1500,
                ease: 'Power2',
                onComplete: function(){
                    this.parent.scene.comicManager.ableToInteract = true;
                }
            });

        }

        this.visiblePanels.push(panel);

        return panel;
    }

    nextPanel() {
        if(this.ableToInteract == true){
            this.currentPanelIndex++;
            
            var panel = this.currentPage.panels[this.currentPanelIndex];

            if (panel != null) {
                if(panel.choiceID != null){
                    // this is a choice
                    var i = this.currentPanelIndex;
                    var choicePanels = [];
                    while(this.currentPage.panels[i] != null && this.currentPage.panels[i].choiceID != null){
                        choicePanels.push(this.currentPage.panels[i]);
                        i++;
                    }

                    this.drawChoices(choicePanels);
                } else {
                    this.drawPanel(panel);
                }
                return false;
            } else {
                // There is no further panel in this page
                this.clearVisiblePanels();
                return this.nextPage();
            }
        }
    }

    drawChoices(choicePanels){
        this.makingChoice = true;
        
        var currentChoicesAvailable = [];
        for(var i = 0; i<this.currentComic.pages.length; i++){
            if(this.currentComic.pages[i].next == "choice"){
                currentChoicesAvailable = currentChoicesAvailable.concat(this.currentComic.pages[i].choices);
            }
        }
        
        // draw panels and handle choice selection
        for(var i = 0; i<choicePanels.length; i++){
            var panel = this.drawPanel(choicePanels[i]);
            
            var next = currentChoicesAvailable.find(x => x.choiceID == choicePanels[i].choiceID).next;
            panel.setInteractive({ cursor: 'url(../../img/cursorHover.cur), pointer', pixelPerfect: true});

            panel.next = next;

            panel.on("pointerdown", function(){
                if(this.scene.comicManager.ableToInteract){
                    this.input.gameObject.scene.comicManager.nextPage(this.input.gameObject.next);
                }
            });
        }

        this.scene.tweens.add({
            targets: this.choiceText,
            alpha: 1,
            duration: 200,
            ease: 'Cubic.InOut'
        });
    }

    nextPage(next = "null") {
        if(next !="null"){
            // a choice pannel was clicked (probably, lol)
            this.clearVisiblePanels();
            this.makingChoice = false;

            // if the next comic is set in the function call
            // find the page in the pageList which corresponds to the "next" value that was passed in
            this.currentPage = this.pageList.find(x => x.pageName === next);
            this.comicPageIndex = this.currentComic.pages.findIndex(x => x.name === this.currentPage.pageName);
            //this.currentPageIndex = this.pageList.findIndex(x => x.pageName === next);
            
            this.drawPanel(this.currentPage.panels[this.currentPanelIndex]);

            this.scene.tweens.add({
                targets: this.choiceText,
                alpha: 0,
                duration: 200,
                ease: 'Cubic.InOut'
            });

            return false;
        } else {
            if (this.currentComic.pages[this.comicPageIndex].next == "none") {
                // Comic is finished
                this.currentlyInComic = false;

                if (this.currentComic.comicName != "Introduction") {
                    this.scene.fadeOutOverlay();
                } else {
                    // extra slow fade out after introduction
                    this.scene.fadeOutOverlay(3000);
                }

                if(this.currentComic.pages[this.comicPageIndex].outcomes != null){
                    // handle outcomes
                    this.handleOutcomes(this.currentComic.pages[this.comicPageIndex].outcomes);
                }

                return true;
            } else {
                // find the page in the pageList which corresponds to this current page's "next" value
                this.currentPage = this.pageList.find(x => x.pageName === this.currentComic.pages[this.comicPageIndex].next);
                //this.currentPageIndex = this.pageList.findIndex(x => x.pageName === this.currentComic.pages[this.comicPageIndex].next);
                
                // Update the index of the page relative to the current comic page list loaded
                this.comicPageIndex = this.currentComic.pages.findIndex(x => x.name === this.currentPage.pageName);

                this.drawPanel(this.currentPage.panels[this.currentPanelIndex]);

                return false;
            }
        }
    }

    clearVisiblePanels(){
        for (var i = 0; i < this.visiblePanels.length; i++) {
            this.scene.tweens.add({
                targets: this.visiblePanels[i],
                y: -this.scene.cameras.main.displayHeight,
                duration: 1000,
                ease: 'Cubic.InOut',
                onComplete: function(){
                    this.targets[0].destroy();
                }
            });
        }

        this.visiblePanels.splice(0, this.visiblePanels.length);

        this.currentPanelIndex = 0;
    }

    handleOutcomes(outcomes){
        //Scene Manager save status method
        this.scene.handleOutcomes(outcomes);
        //console.log(outcomes);
    }

    resizeComics(){
        for (var i = 0; i < this.visiblePanels.length; i++) {
            var panel = this.visiblePanels[i];

            var aspectRatio = panel.displayWidth / panel.displayHeight;
            panel.displayHeight = this.scene.cameras.main.displayHeight;
            panel.displayWidth = panel.displayHeight * aspectRatio;

            panel.x = this.scene.cameras.main.centerX;
            panel.y = this.scene.cameras.main.centerY;
        }
    }
}