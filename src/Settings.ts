/*
 * this is a class that controls what happens during the game
 * and the settings or accessibility of the game so you can 
 * change it if you want
 */
export class Settings {

    public playMusic: boolean;
    public playEvents: boolean;

    game_music: p5.SoundFile;
    mikeFrames: p5.Image[] = [];
    mikeIndex: number = 0;
    mikeImg: any;
    storyText: any;
    menu:  p5.Element;
    full: p5.Element;
    
    constructor() {

        // putting in a reference for M1K3's animation
        this.mikeFrames = [
        loadImage("assets/images/lil_dude1.png"),
        loadImage("assets/images/lil_dude2.png"),
        loadImage("assets/images/lil_dude3.png"),
        loadImage("assets/images/lil_dude4.png"),
        loadImage("assets/images/lil_dude5.png")
    ];
       /*
         * all of these initialize certain things in our game to make it run smooth
         */
        this.playMusic=false;
        this.playEvents=true;

        this.menu=createDiv();
        this.menu.position(30, 30);

        this.menu.style("background-color","rgba(80, 142, 156, 0.88)");
        this.menu.position(30,30);
        this.menu.style("color","#000000");
        this.menu.style("box-sizing", "border-box");
        this.menu.style("font-family", "Courier New, monospace");
        this.menu.style("font-size", "18px");

        this.menu.style("line-height", "1.35");

        // M1K3's placement in the menu
        this.mikeImg = createImg("assets/images/m1k3_1.png", "M1K3");

        this.mikeImg.style("position", "absolute");
        this.mikeImg.style("top", "30px");
        this.mikeImg.style("right", "30px");
        this.mikeImg.style("width", "180px");
        this.mikeImg.style("height", "180px");

        this.menu.child(this.mikeImg);

        // M1K3's speaking section/Storyline

        // this separates our the top section and bottom section
        const storylineSection = createDiv();
        storylineSection.style("height", "50");
        storylineSection.style("width", "70%");
        storylineSection.style("border-bottom", "3px dashed black");
        storylineSection.style("padding-bottom", "15px");

        // Creating the Title of the game on the menu
        const storyTitle = createDiv("R0b3rt's Circuit Adventure!");
        storyTitle.style("font-size", "32px");
        storyTitle.style("font-weight", "bold");
        storyTitle.style("margin-bottom", "5px");

        // M1K3's little blurb
        const storyIntro = createDiv(
            "Hello World! My name is M1K3 and I'm here to help you on your adventure, R0b3rt!");
        this.storyText = createDiv("...");

        // actually putting it on the screen
        storylineSection.child(storyTitle);
        storylineSection.child(storyIntro);
        storylineSection.child(this.storyText);
        // Game Mechanics Section

        // this is created so the the game mechanic stuff is placed lower in the menu
        const mechanicsSection = createDiv();
        mechanicsSection.style("height", "50%");
        mechanicsSection.style("padding-top", "5px");

        // creating the game mechanics title to be similar size to the game title
        const mechanicsTitle = createDiv("Game Mechanics");
        mechanicsTitle.style("font-size", "32px");
        mechanicsTitle.style("font-weight", "bold");
        mechanicsTitle.style("margin-bottom", "5px");

        /* making the game controls into an easier bigger statement, and using line breaks so
        it is properly formatted on the menu */
        const controls = createDiv(
        "W / ↑ : Jump<br>" +
        "A / ← : Move Left<br>" +
        "D / → : Move Right<br>" +
        "H: Hold nearby items<br>" +
        "R: Restart the level<br>" +
        "You can always press 'M' to bring this menu back up!"
        ); 

        // creating the check box for playing music
        const music = createCheckbox(" Play Music", this.playMusic);
        music.mousePressed(this.togglePlayMusic.bind(this));

        // creating the check box for playing event sounds
        const events = createCheckbox(" Play Event Sounds", true);
        events.mousePressed(this.toggleEventSounds.bind(this));

        // creating the check box for full screen
        this.full = createCheckbox(" Full Screen", false);
        this.full.mousePressed(this.toggleFullScreen.bind(this));

        /* this is how it is visually on the menu, 
        I moved it all together instead of how it was before */
        mechanicsSection.child(mechanicsTitle);
        mechanicsSection.child(controls);
        mechanicsSection.child(music);
        mechanicsSection.child(events);
        mechanicsSection.child(this.full);

        // displaying
        this.menu.child(storylineSection);
        this.menu.child(mechanicsSection);

        this.menu.hide();
} 
     /*   
     * this shows the menu 
     * it sets it to a certain width and height as well
     */
    showMenu() {
        let scaleFactor=min(width/800,height/600);
        this.menu.size(800*scaleFactor-60,600*scaleFactor-60);
        this.menu.show();
    }
    /*
     * this is the hide menu, if the menu isn't shown, then this function 
     * is called to hide the menu
     */
    hideMenu() {
        this.menu.hide();
    }
    /*
     * this is the toggle full screen, it checks to see if the player
     * wants to play in full screen or not
     */
    toggleFullScreen() {
        fullscreen(!fullscreen());
    }

    /*
     * this method toggles the playing of our music
     * if they have it on, it is on a loop and once the loop ends it restarts and plays again
     * if they have it off, the music won't play
     */
    togglePlayMusic() {
        this.playMusic=!this.playMusic;
        if (this.playMusic) {
            this.game_music.setLoop(true);
            this.game_music.playMode("restart");
            this.game_music.play();
        } else {
            this.game_music.stop();
        }
    }

    /*
     * this sets a certain soundfile to 'm' which is the music
     */
    setMusic(m:p5.SoundFile) {
        this.game_music=m;
    }

    /*
     * this toggles event sounds, to see if they are played or not
     */
    toggleEventSounds() {
        this.playEvents=!this.playEvents;
    }
    
    // Set to animate mike
    animateMike() {
    if (frameCount % 10 == 0) {
        this.mikeIndex++;
        if (this.mikeIndex >= this.mikeFrames.length) {
            this.mikeIndex = 0;
        }
        this.mikeImg.attribute(
            "src",
            "assets/images/lil_dude" + (this.mikeIndex + 1) + ".png"
        );
    }
} 
    // everytime you get to a new level the text on the menu will change
    updateLevelText(level: number) {
        if (level == 0) {
            this.storyText.html(
                "This is the first level. You'll learn about switches, movement, and doors here.<br>" +
        "Go ahead and try pressing 'H' on the switch, it just might open the the door for you!"
            );
        }
        else if (level == 1) {
            this.storyText.html (
            "Great Job!!!! Alright friend, this next level you will see your first gate" +
            "Press 'H' to pick it up and move it to the logic station!"
         );
        }
    }

}
