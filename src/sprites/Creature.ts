import { Sprite } from "./Sprite.js";
import { GameMap } from "../GameMap.js";
import { FinalBoss } from "./FinalBoss.js";

/**
 * A Creature is a Sprite that is affected by gravity and can die.
 * It can also effect the Map on which it exists.
 */

export enum CreatureState { DEAD, DYING, NORMAL };
/**
 * sub class creature which extends super class Sprite
 */
export class Creature extends Sprite {
    /**
     * the time it takes the creature to die
     */
    DIE_TIME = 1000;
    /**
     * the state of the creature
     */
    state:CreatureState;
    /**
     * the amount of time the creature has been in its current state
     */
    stateTime:number;
    /**
     * this initializes the state and stateTime properties
     */
    constructor() {
        super();
        this.state=CreatureState.NORMAL;
        this.stateTime=0;
    }
    /**
     * clone function that creates a copy of the current creature
     * and its state and stateTime properties
     * @returns 
     */
    clone() {
         let s = super.clone();
         s.state = this.state;
         s.stateTime = this.stateTime;
         return s;
    }
    /**
     * applies the creatures effect on the map
     * @param map 
     */
    effectMap(map:GameMap) {

    }
    /**
     * gets the state of the creature
     * @returns 
     */
    getState() {
        return this.state;
    }
    /**
     * sets the state of the creature to alive or dead
     * @param st 
     */
    setState(st:CreatureState) {
        if (st!=this.state) {
            this.stateTime=0;
            this.state=st;
            /**
             * this is saying if the creature is dead, the velocity is zero
             * and if it is facing left, the animation deadLeft will play
             */
            if (this.state == CreatureState.DYING) {
                this.setVelocity(0,0);
                if (this.currAnimName.toUpperCase().includes("LEFT")) {
                    console.log("deadLeft");
                    this.setAnimation("deadLeft");
                }
                 /**
             * this is saying if the creature is dead, the velocity is zero
             * and if it is facing right, the animation deadRight will play
             */
                if (this.currAnimName.toUpperCase().includes("RIGHT")) {
                    console.log("deadRight");
                    this.setAnimation("deadRight");
                }
            }
        }
    }
    /**
     * wakes the creature up if it is not moving and if
     * it is in its normal state
     */
    wakeUp() {
        if (this.getState() == CreatureState.NORMAL && this.velocity.x == 0) {
            this.setVelocity(-this.getMaxSpeed(),0);
        }
    }
    /**
     * gets the max speed of the creatures
     * @returns 
     */
    getMaxSpeed() {
        return 0;
    }
    /**
     * updates the creatures animation and state tiem
     * @param deltaTime
     */
    update(deltaTime:number) {
        let newAnim=""
        /**
         * determines the direction based on the x velocity
         */
        if (this.velocity.x < 0 ) {
            newAnim="left";
        } else if (this.velocity.x > 0) {
            newAnim="right";
        }
        /**
         * if the direction of movement changed
         * set it to a new animation
         */
        if (newAnim!="" && newAnim!=this.currAnimName) {
            this.setAnimation(newAnim);    
        } else {
            /**
             * otherwise call upon the superclass to update the animation
             */
            super.update(deltaTime);
        }
        /**
         * this increments the state time
         */
        this.stateTime+=deltaTime;
        /**
         * if the creature is dying and the stateTime is greater than the die time
         * set the creature to dead
         */
        if (this.state == CreatureState.DYING && this.stateTime > this.DIE_TIME) {
            this.setState(CreatureState.DEAD);
        }
    }

}
/**
 * sub class grub which extends a superclass creature
 */
export class Grub extends Creature {
    /**
     * gets the max speed of the grub
     * @returns
     */
    getMaxSpeed() {
        return 0.05;
    }
}
/**
 * sub class fly which extends a superclass creature
 */
export class Fly extends Creature {
    /**
     * sets the creature to flying as the normal state
     * @returns 
     */
    isFlying() {
        return this.state==CreatureState.NORMAL;
    }
    /**
     * gets the max speed of the fly
     * @returns 
     */
    getMaxSpeed() {
        return 0.15;
    }
}