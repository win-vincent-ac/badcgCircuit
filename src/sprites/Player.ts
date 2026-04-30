import { Vector } from "p5";
import { Creature, CreatureState } from "./Creature.js";
import { Sprite } from "./Sprite.js";
/**
 * defines the player class as a subclass of creature
 */
export class Player extends Creature {
    /**
     * defines some of the properties of the player
     */
    MAX_SPEED:number;
    JUMP_SPEED:number;
    MAX_FUEL:number;
    onGround:boolean;
    jetPackOn:boolean;
    thrusterAmount:number;
    fuel:number;
    numBullets: number;
    lives: number;
    doubleJump:boolean;
    
    /**
     * the function of the player class
     */
    constructor() {
        /**
         * calls the constructor of the super class
         */
        super();
        /**
         * sets initial values for the player class
         */
        this.MAX_FUEL=7500;
        this.MAX_SPEED=0.35;
        this.JUMP_SPEED=0.80;
        this.thrusterAmount=0.003;
        this.fuel=7500;
        this.numBullets = 3;
        this.lives = 3;
        this.onGround=false;
        this.jetPackOn=false;
        this.doubleJump=true;
    }
    /**
     * function to get the amount of fuel the jetpack is using
     * @returns 
     */
    getThursterAmount():number {
        if (this.jetPackOn) {
            this.fuel-=this.thrusterAmount;
            return this.thrusterAmount
        }
        return 0.0;
    }
    /**
     * function to get the number of lives the player has
     * @returns 
     */
    getLives():number{
        return this.lives;
    }
    /**
     * function to check to see if the jetpack is on
     * @returns 
     */
    isJetPackOn():boolean {
        return this.jetPackOn;
    }
    /**
     * function to get the maximum speed the player can move in the x-direction
     * @returns
     */
    getMaxSpeed():number {
        return this.MAX_SPEED;
    }
    /**
     * function to get the number of bullets the player has
     * @returns 
     */
    getnumBullets():number {
        return this.numBullets;
    }
    /**
     * function to check to see if player is permitted double jump
     * @returns 
     */
    getDoubleJump():boolean {
        return this.doubleJump;
    }
    /**
     * function that handles the collision with vertical surfaces
     */
    collideVertical() {
        if (this.velocity.y > 0) {
            this.onGround=true;
            this.doubleJump=true;
        }
        this.velocity.y=0;
    }
    /**
     * function that handles the conllision with horizontal surfaces
     */
    collideHorizontal() {
        this.velocity.x=0;
    }
    /**
     * funtion to restart the level
     */
    restartLevel(){
        this.state=CreatureState.DEAD;
    }
    /**
     * function to handle jumping
     * @param forceJump
     */
    jump(forceJump:boolean) {
        if (this.onGround || this.doubleJump || forceJump) {
            if (!this.onGround) {
                this.doubleJump=false;
            }
            this.onGround=false;
            this.setVelocity(this.velocity.x,-this.JUMP_SPEED);
        }
    }

    

    /**
     * function to set the players position
     * @param x 
     * @param y 
     */
    setPosition(x:number, y:number) {
        /**
         * check if falling
         */
        if (Math.round(y) > Math.round(this.position.y)) {
            this.onGround=false;
        }
        /**
         * calls the setPosition function of the superclass
         */
        super.setPosition(x,y);
    }
    /**
     * function to add the velocity to the player
     * @param x 
     * @param y 
     */
    addVelocity(x:number,y:number) {
        /**
         * adds x and y to the velocity vector
         */
        this.velocity.add(x,y);
        /**
         * checks to see if the x component of the velocity is greater than 
         * the max speed, if it is, set the max speed to that x component
         */
        if (this.velocity.x>this.MAX_SPEED) {
            this.velocity.x=this.MAX_SPEED;
        /**
         * checks to see if the x component is less than or equal to the negative
         * velocity, if it is set the negative max speed to the x component
         */
        } else if (this.velocity.x<=-this.MAX_SPEED) {
            this.velocity.x=-this.MAX_SPEED;
        }
        /**
         * checks to see if the y component of the velocity is greater than 
         * the max speed, if it is, set the max speed to that y component
         */
        if (this.velocity.y>this.MAX_SPEED) {
            this.velocity.y=this.MAX_SPEED;
            /**
         * checks to see if the y component is less than or equal to the negative
         * velocity, if it is set the negative max speed to the y component
         */
        } else if (this.velocity.y<-this.MAX_SPEED) {
            this.velocity.y=-this.MAX_SPEED;
        }
    }
    /**
     * creates a clone of the player
     * @returns 
     */
    clone() {
        /**
         * creates a new player object 
         */
        let p = new Player();
        /**
         * sets the position and velocity of the new Player
         */
        p.position = this.position.copy();
        p.velocity = this.velocity.copy();
        p.animations={};
        /**
         * this if loop looks through all the keys in the current players 
         * animations object
         */
        for (const key in this.animations) {
            /**
             * checks to see if the current key is a property of the 
             * animations object
             */
            if (Object.prototype.hasOwnProperty.call(this.animations, key)) {
                /**
                 * gets the current animation key
                 */
                const element = this.animations[key];
                /**
                 * sets the animation at the current key fpr the new players animation
                 */
                p.animations[key]=element.clone();
            }
        }
        /**
         * sets the current animation name
         */
        p.currAnimName = this.currAnimName;
        /**
         * sets the current animation
         */
        p.currAnimation = p.animations[p.currAnimName];
        /**
         * sets the max speed of the new player
         */
        p.MAX_SPEED=this.MAX_SPEED;
        return p;
    }
    /**
     * checks to see if the jetpack is turned on
     */
    turnOnJetPack(){
        /**
         * sets the jetpack status to true if the player is not on the ground
         */
        this.jetPackOn=true;
        this.onGround=false;
    }
    /**
     * this checks to see how much fuel a person is using if the 
     * jetpack is on
     */
    useFuel(){
        /**
         * if the jetpack is on, then decrease the amount of fuel
         * by the time passed since the last frame
         */
        if(this.jetPackOn){
            this.fuel-=deltaTime;
        }
        /**
         * if the fuel level is less than or equal to zero,
         * set the fuel level to zero
         * and set the jetpack status to off
         */
        if(this.fuel<=0){
            this.fuel=0;
            this.jetPackOn=false;
        }
    }
   /**
    * method to check if the jetpack is turned off
    */ 
    turnOffJetPack(){
        this.jetPackOn=false;
    }
    /**
     * sets the maximum speed to the current speed of the player
     * @param speed 
     */
    changeMaxSpeed(speed: number){
        this.MAX_SPEED=speed;
    }
    /**
     * this changes the jump speed of the player
     * @param speed 
     */
    changeJumpSpeed(speed: number){
        this.JUMP_SPEED=speed;
    }
    /**
     * this updates the state of the player based on its
     * velocity and jetpack usage
     * @param deltaTime 
     */
    update(deltaTime:number) {
        let newAnim="";
        if (this.state==CreatureState.NORMAL) {
            /**
             * updates fuel usage if jetpack is on
             */
            this.useFuel();
            /**
             * determines the animation based on velocity
             * and jetpack usage
             */
            if (this.velocity.x<0) {
                if (this.jetPackOn) {
                    newAnim="jetLeft";
                } else {
                    newAnim="left";
                }
            } else if (this.velocity.x>0) {
                if (this.jetPackOn) {
                    newAnim="jetRight";
                } else {
                    newAnim="right";
                }
            } else {
                if (this.jetPackOn) {
                    if (this.currAnimName.toUpperCase().includes("LEFT")) {
                        newAnim="jetLeft";
                    } else {
                        newAnim="jetRight";
                    }
                } else {
                    if (this.currAnimName.toUpperCase().includes("LEFT")) {
                        newAnim="stillLeft";
                    } else {
                        newAnim="stillRight";
                    }
                }
            }
    }
    /**
     * if the animation has changed, set it
     */
        if (newAnim!="" && newAnim!=this.currAnimName) {
            this.setAnimation(newAnim);    
        } else {
            /**
             * otherwise update animation
             */
            this.updateAnimation(deltaTime);
        }
        /**
         * increment the statetime
         */
        this.stateTime+=deltaTime;
        /**
         * if the creature is dying and the state time exceeded the die time
         * set it to dead
         */
        if (this.state == CreatureState.DYING && this.stateTime > this.DIE_TIME) {
            this.setState(CreatureState.DEAD);
        }
    }
}