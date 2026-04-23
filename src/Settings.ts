/*
 * this is a class that controls what happens during the game
 * and the settings or accessibility of the game so you can 
 * change it if you want
 */
export class Settings {

    public playMusic: boolean;
    public playEvents: boolean;

    music: p5.SoundFile;


    menu:  p5.Element;
    full: p5.Element;
    
    constructor() {
        /*
         * all of these initialize certain things in our game to make it run smooth
         */
        this.playMusic=false;
        this.playEvents=true;

        this.menu=createDiv();
        this.menu.style("background-color","rgba(27,212,121,0.60)");
        this.menu.position(30,30);
        this.menu.style("color","#000000");


        let myDivt = createDiv("Welcome to an example game based on Apollo 18!");
        this.menu.child(myDivt);

        let music=createCheckbox("Play Music",this.playMusic);
        music.mousePressed(this.togglePlayMusic.bind(this));
        this.menu.child(music);

        let events=createCheckbox("Play Event Sounds",true);
        events.mousePressed(this.toogleEventSounds.bind(this));
        this.menu.child(events);

        this.full = createCheckbox("Full Screen",false);
        this.full.mousePressed(this.toggleFullScreen.bind(this));
        this.menu.child(this.full);

        let myDiv = createDiv("Up: Jump");
        let myDiv1 = createDiv("Left: Left");
        let myDiv2 = createDiv("Right: Right");
        let myDiv3 = createDiv("R: Restart the level");
        let myDiv4 = createDiv("Objective: Collect all of the medallions on each level to advance to the next. You can collect ammo packs and shoot bullets at enemies. You can also thrust upwards with your jetpack and collect fuel packs to fly longer. If you lose all of you lives you are taken back to the beginning of the game.");
		let myDiv5 = createDiv("====== Press M to toggle this menu! ======");
        this.menu.child(myDiv);
        this.menu.child(myDiv1);
        this.menu.child(myDiv2);
        this.menu.child(myDiv3);
        this.menu.child(myDiv4);
        this.menu.child(myDiv5);
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
            this.music.setLoop(true);
            this.music.playMode("restart");
            this.music.play();
        } else {
            this.music.stop();
        }
    }

    /*
     * this sets a certain soundfile to 'm' which is the music
     */
    setMusic(m:p5.SoundFile) {
        this.music=m;
    }

    /*
     * this toggles event sounds, to see if they are played or not
     */
    toogleEventSounds() {
        this.playEvents=!this.playEvents;
    }
}
