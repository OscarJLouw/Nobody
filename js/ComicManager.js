class ComicManager {
    constructor(scene) {
        this.scene = scene;
        this.visiblePannels = [];
        this.currentlyInComic = false;

        // Page List
        this.pageList = [
            {
                pageName: "Intro_1",
                pannels: [
                    "testPanel1",
                    "testPanel2",
                    "testPanel3",
                ],
                animations: [
                    "none",
                    "fade",
                    "fade",
                    "slide"
                ]
            },
            {
                pageName: "Intro_2",
                pannels: [
                    "testPanel4",
                    "testPanel5"
                ],
                animations: [
                    "none",
                    "none"
                ]
            }
        ];

        // Comic List
        this.comicList = [
            {
                comicName: "Introduction",
                pages: [
                    {name:"Intro_1", next:"Intro_2"},
                    {name:"Intro_2", next:"none"}
                ]
            }
        ]
    }

    loadComics(scene){
        scene.load.image("testPanel1", "../../img/Comics/Intro/testpanel1.png");
        scene.load.image("testPanel2", "../../img/Comics/Intro/testpanel2.png");
        scene.load.image("testPanel3", "../../img/Comics/Intro/testpanel3.png");
        scene.load.image("testPanel4", "../../img/Comics/Intro/testpanel4.png");
        scene.load.image("testPanel5", "../../img/Comics/Intro/testpanel5.png");
    }

    startComic(comicName){
        this.currentlyInComic = true;
        this.currentComic = this.comicList.find(x => x.comicName === comicName);
        this.currentPageIndex = 0;
        this.currentPage = this.pageList.find(x => x.pageName === this.currentComic.pages[0].name);
        this.currentPannelIndex = 0;

        this.drawPannel(this.currentPage.pannels[this.currentPannelIndex]);
    }

    drawPannel(pannelName){
        var pannel = this.scene.add.image(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, pannelName);

        var aspectRatio = pannel.displayWidth / pannel.displayHeight;
        pannel.displayHeight = this.scene.cameras.main.displayHeight;
        pannel.displayWidth = pannel.displayHeight * aspectRatio;
        
        pannel.setDepth(99999);
        pannel.setScrollFactor(0);

        this.visiblePannels.push(pannel);
    }

    nextPannel(){
        this.currentPannelIndex++;

        if(this.currentPage.pannels[this.currentPannelIndex] != null){
            this.drawPannel(this.currentPage.pannels[this.currentPannelIndex]);
            
            return false;
        } else {
            for(var i = 0; i<this.visiblePannels.length; i++){
                this.visiblePannels[i].destroy();
            }

            this.currentPannelIndex = 0;

            return this.nextPage();
        }
    }

    nextPage(){

        if(this.currentComic.pages[this.currentPageIndex].next == "none"){
            // Comic is finished
            this.currentlyInComic = false;
            
            return true;
        } else {
            this.currentPage = this.pageList.find(x => x.pageName === this.currentComic.pages[this.currentPageIndex].next);
            this.currentPageIndex = this.pageList.findIndex(x => x.pageName === this.currentComic.pages[this.currentPageIndex].next);
            this.drawPannel(this.currentPage.pannels[this.currentPannelIndex]);

            return false;
        }
    }
}