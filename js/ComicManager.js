class ComicManager {
    constructor(scene) {
        this.currentComic = "";
        this.currentPage = 0;
        this.currentPannel = 0;

        // Page List
        this.pageList = [
            {
                pageName: "Intro_1",
                pannels: [
                    "testPannel1",
                    "testPannel2",
                    "testPannel3",
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
                    "testPannel4",
                    "testPannel5"
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
                    "Intro_1",
                    "Intro_2"
                ]
            }
        ]
    }

    preload(scene){
        scene.load.image("testPannel1", "../../img/Comics/Intro/testpannel1.jpg");
        scene.load.image("testPannel2", "../../img/Comics/Intro/testpannel2.jpg");
        scene.load.image("testPannel3", "../../img/Comics/Intro/testpannel3.jpg");
        scene.load.image("testPannel4", "../../img/Comics/Intro/testpannel4.jpg");
        scene.load.image("testPannel5", "../../img/Comics/Intro/testpannel5.jpg");
    }

    startComic(comicName){
        this.currentComic = comicName;
    }

    nextPannel(){
        // if no more pannels in page
        var finalPage = this.nextPage();

        return finalPage;
    }

    nextPage(){
        // 
        return false;

    }
}