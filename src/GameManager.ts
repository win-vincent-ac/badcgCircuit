import { Settings } from "./Settings.js";
import { GameAction } from "./GameAction.js";
import { GameMap } from "./GameMap.js";
import { InputManager } from "./InputManager.js";
import { ResourceManager } from "./ResourceManager.js";
import { CreatureState } from "./sprites/Creature.js";
import { Delay, Image, Renderer } from "p5";

export const GRAVITY: number =  0.0014;
const FONT_SIZE: number = 24;

export enum STATE {Loading, Menu, Running, Finished}
export class GameManager {
	
    resources: ResourceManager;  //the resovoir of all loaded resources
    map: GameMap; //the current state of the game
    inputManager: InputManager; //mappings between user events (keyboard, mouse, etc.) and game actions (run-left, jump, etc.)
    settings: Settings;
    oldState: STATE;
    gameState: STATE; //the different possible states the game could be in (loading, menu, running, finished, etc.)
    level: number;
    moveRight: GameAction;
    moveLeft: GameAction;
    jump: GameAction;
    stop: GameAction;
    restart: GameAction;
    img1: Image;
    img2: Image;

    constructor() {
        this.img1 = loadImage("assets/images/medallion1.png");
        this.img2 = loadImage("assets/images/life1.png");
        this.level=0;
        this.oldState=STATE.Loading;
        this.gameState=STATE.Loading;
        this.resources=new ResourceManager("assets/assets.json");
        this.inputManager = new InputManager();
        this.settings = new Settings();
        this.moveRight=new GameAction();
        this.moveLeft=new GameAction();
        this.jump=new GameAction();
        this.stop=new GameAction();
        this.restart=new GameAction();
        
    }
    
    draw() {
        switch (this.gameState) {
            /*
             * if it is running, then certain things happen
             */
            case STATE.Running: { 
                textStyle()
                this.map.draw();
                text(this.map.lives,45,70);
                fill(150,150,200,150);
                rect(10,10,55,85);
                fill(255,255,255);
                image(this.img1, 15, 15, 32, 32);
	            image(this.img2, 8, 41, 48, 48);
                
                textSize(12);
                
                text(this.map.lives,45,70);
                text(this.map.medallions,45,36);
                
                break;
            }
            /*
             * draws an overlay which is an menu that has a description of the game
             */
            case STATE.Menu: {
                this.map.draw();
                this.settings.showMenu();
                break;
            }
            /*
             * this is the state of our game which means its loading
             */
            case STATE.Loading: {
                break;
            }
            /*
             * the code is done, not doing anything
             */
            case STATE.Finished: {
                fill(255,0,0);
                rect(0,0,800,600);
                fill(0,0,255);
                rect(30,30,740,540);
                fill(0,0,0);
                rect(60,60,680,480);
                textSize(64);
                fill(227,197,0);
                text("You Win!",265,200);
                textSize(32);
                text("Original Creators of Apollo 18",250,280);
                textSize(16);
                text("Henry Roeth",340,330);
                text("Tristan Adamson",324,405);
                text("Aidan Griffin",340,480);
                text("Reload server to restart!",308,100);
                text("Editted for Class by Daniel Gavazzi",265,525);
                break;
            }
            default: {
                /**
                 * should never happen
                 */
                break;
            }
        }
    }
    
    update() {
        /*
         * checks to see if the game is running
         */
        switch (this.gameState) {
            /*
             * if the game is running then certain actions happen
             */
            case STATE.Running: {
                /*
                 * This is the main steps as the game is running to play the game
                 * this.map.update updates the map as the player plays
                 * this.inputManager.checkInput checks to see what keys are being pressed
                 * this.processActions checks to see what action needs to happen, it correlates
                 * with the inputManager
                 */
                this.map.update();
                this.inputManager.checkInput();
                this.processActions();
                break;
            }
            case STATE.Menu: {
                break;
            }
            case STATE.Loading: {
                /*
                 * Setup the listeners and game by constructing the GameMap and assigning input to functions
                 */
                if (this.resources.isLoaded()) {                    
                    this.map=new GameMap(this.level,this.resources,this.settings,this);
                    this.settings.setMusic(this.resources.getLoad("music"));
                    this.inputManager.setGameAction(this.moveRight,RIGHT_ARROW);
                    this.inputManager.setGameAction(this.moveLeft,LEFT_ARROW);
                    this.inputManager.setGameAction(this.jump,UP_ARROW);
                    this.inputManager.setGameAction(this.moveRight,68);
                    this.inputManager.setGameAction(this.moveLeft,65);
                    this.inputManager.setGameAction(this.jump,87);

                    /**
                     * sets the "R" key to restart our game
                     */
                    this.inputManager.setGameAction(this.restart,82);

                    this.oldState=STATE.Running;
                    this.gameState=STATE.Menu;                
                }
                break;
            }
            case STATE.Finished: {
                break;
            }
            default: {
                //should never happen
                break;
            }
        }
    }
    /*
    * Processes the player's input actions and updates the game state accordingly.
    */
    processActions() {
        /*
         * gets the players current velocity as an x and y "vector"
         */
        let vel=this.map.player.getVelocity();
        vel.x=0;

        //WHEN WALKING SOUND EFFECT IS MADE REPLACE robot_jump WITH robot_walk
        if (this.moveRight.isPressed() && this.map.player.getState()==CreatureState.NORMAL) {
            if(this.moveRight.isPressed() && this.map.player.onGround && !this.map.robot_temp.isPlaying()) {this.map.robot_temp.play();}
            
            vel.x=this.map.player.getMaxSpeed();
        }
        if (this.moveLeft.isPressed() && this.map.player.getState()==CreatureState.NORMAL) {
            if(this.moveLeft.isPressed() && this.map.player.onGround && !this.map.robot_temp.isPlaying()) {this.map.robot_temp.play();}
            
            vel.x=-this.map.player.getMaxSpeed();
        }
        /*
         * updates the players velocity based on key press
         */

        this.map.player.setVelocity(vel.x,vel.y);
        
        if (this.jump.isPressed() && this.map.player.getState()==CreatureState.NORMAL) {
            if (this.map.player.onGround) {
                this.map.robot_jump.play();
            }
            this.map.player.jump(false);
        }
        
        if(this.restart.isBeginPress()){
            this.level==0;
            this.map.initialize();
            this.map.medallions=0;
            this.gameState=STATE.Running;
        }

    }
    
    toggleFullScreen() {
        this.settings.toggleFullScreen();
    }

    /*
     * this method allows the user to toggle the begining menu
     */
    toggleMenu() {        
        if (this.gameState==STATE.Menu) {
            this.gameState=this.oldState;

            if (this.gameState!=STATE.Menu) {
                this.settings.hideMenu();
            } else {
                this.settings.showMenu();
            }
        } else {
            this.oldState=this.gameState;
            this.gameState=STATE.Menu;
            this.settings.showMenu();
        }
    }
}