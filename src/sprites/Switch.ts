/**
 * A switch is an object in the game that takes a start circuit and powers it when toggled.
 */

import { Circuit, CircuitPower } from "./Circuit.js";
import { Sprite } from "./Sprite.js";
import { Star } from "./PowerUp.js";


export enum SwitchState { ON, OFF }; 

export class Switch extends Star {

    protected state: number;
    protected full: boolean;
    protected output: Circuit;
    protected locked: boolean;

    constructor() { 
        super();
        this.state = SwitchState.OFF;
        this.full = false;
        this.locked = false;
        
    }
    changeState(initialState: number) {
        //console.log("Switch State Changing");
        switch (initialState) {
            case SwitchState.ON: {
                this.state=SwitchState.ON;
                this.setAnimation("on");
                //console.log("Switch State Change On");
                break;
            }
            case SwitchState.OFF: {
                this.state=SwitchState.OFF;
                this.setAnimation("off");
                //console.log("Switch State Change Off");
                break;
            }
        }
    }

    checkSwitch() {
       //console.log("Checking Power"); //Checks Power
        if (this.output != null) {
           //console.log("Switch Not Null"); 
            if (this.output.getPower() == CircuitPower.ON) {
                //console.log("Turning Power On");
                this.output.addPower();
                //console.log("Switch Gives Power");
            }
            else {
                if (this.output != null) {
                this.output.removePower(); }
               //console.log("Switch unPower");
                }
            }
        //console.log("Done Checking Power");
    }

    getState() {
        return this.state;
    }

    syncOutput(c: Circuit) {
        if (this.output != null) {
            this.output = c;
            if (SwitchState.ON) {
                c.addPower();
            } else {
                c.removePower();
            }
        }
    }

    getSource() {
        return this.output;
    }

    isLocked () {
        return this.locked;
    }

    isFull() {
        return this.full;
    }
}
