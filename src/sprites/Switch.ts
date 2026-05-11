/**
 * A switch is an object in the game that takes a start circuit and powers it when toggled.
 */

import { Circuit, CircuitPower } from "./Circuit.js";
import { Sprite } from "./Sprite.js";


export enum SwitchState { ON, OFF }; 

export class Switch extends Sprite {

    protected state: number;
    protected full: boolean;
    protected source: Circuit;
    protected locked: boolean;

    constructor() { 
        super();
        this.state = SwitchState.OFF;
        this.full = false;
        this.locked = false;
        
    }
    changeState(initialState: number) {
        switch (initialState) {
            case SwitchState.ON: {
                this.state=SwitchState.ON;
                this.setAnimation("on");
                break;
            }
            case SwitchState.OFF: {
                this.state=SwitchState.OFF;
                this.setAnimation("off");
                break;
            }
        }
    }

    checkPower() {
        //console.log("Checking Power");
        if (this.source != null) {
            console.log("This Power Source Not Null");
            if (this.source.getPower() == CircuitPower.ON) {
                //console.log("Turning Power On");
                this.power = CircuitPower.ON;
                console.log("Power On");
            }
            else {
                this.power = CircuitPower.OFF;
                console.log("Power Off");
                }
            }
        //console.log("Done Checking Power");
    }

    getState() {
        return this.state;
    }

    syncOutput(c: Circuit) {
        this.source = c;
        if (SwitchState.ON) {
            c.addPower();
        } else {
            c.removePower();
        }
    }

    getSource() {
        return this.source;
    }
}
