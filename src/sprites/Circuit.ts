import { Star } from "./PowerUp.js";
import { Switch, SwitchState } from "./Switch.js";
import { Station, StationState } from "./Station.js";

export enum CircuitState { START, END };

export enum CircuitNumber { ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE };

export enum CircuitPower { ON, OFF };

export class Circuit extends Star {

    protected state: number;
    protected power: number;
    protected number: number;
    protected locked: boolean;
    protected placed: boolean;
    protected source: Circuit | Station | Switch;

    constructor() {
        super();
        this.locked = false;
        this.placed = false;
        this.power = CircuitPower.OFF;
    }
    changeState(initialState: number, initialNumber: number) {
        switch (initialState) {
            case CircuitState.START: {
                this.state=CircuitState.START;
                switch (initialNumber) {
                    case CircuitNumber.ONE: {
                    this.setAnimation("one_start");
                    break;
                    }
                    case CircuitNumber.TWO: {
                    this.setAnimation("two_start");
                    break;
                    }
                    case CircuitNumber.THREE: {
                    //this.setAnimation("three_start");
                    break;
                    }
                }
                //this.setAnimation("zero_start");
                break;
            }
            case CircuitState.END: {
                this.state=CircuitState.END;
                switch (initialNumber) {
                    case CircuitNumber.ONE: {
                    this.setAnimation("one_end");
                    break;
                    }
                    case CircuitNumber.TWO: {
                    this.setAnimation("two_end");
                    break;
                    }
                    case CircuitNumber.THREE: {
                    //this.setAnimation("three_end");
                    break;
                    }
                }
                //this.setAnimation("zero_end");
                break;
            }
        }
    }
    getState() {
        return this.state;
    }
    getPower() {
        return this.power;
    }
    lockCircuit(){
        this.locked = true;
    }
    stopMoving() {
        this.placed = true;
    }
    startMoving() {
        this.placed = false;
    }
    isPlaced() {
        return this.placed;
    }
    syncStart(s: Circuit) {
        this.source = s;
    }
    syncSwitch(s: Switch) {
        this.source = s
    }
    addPower () {
        this.power = CircuitPower.ON;
    }
    removePower () {
        this.power = CircuitPower.OFF;
    }
    checkPower() {
       //console.log("Checking Power");
        if (this.source != null) {
           //console.log("This Power Source Not Null");
            if (this.source instanceof Station) {
                if ((this.source as Station ).getState() == StationState.ON) {
                   //console.log("St.Turning Power On");
                    this.power = CircuitPower.ON;
                  //console.log("St.Power On");
                }
                else {
                    this.power = CircuitPower.OFF;
                  //console.log("St.Power Off");
                    }
            } else if (this.source instanceof Switch) {
                if ((this.source as Switch).getState() == SwitchState.ON) {
                   //console.log("Sw.Turning Power On");
                    this.power = CircuitPower.ON;
                   //console.log("Sw.Power On");
                }
                else {
                    this.power = CircuitPower.OFF;
                  //console.log("Sw.Power Off");
                    }
            } else if (this.source instanceof Circuit) {
                if ((this.source as Circuit ).getState() == CircuitPower.ON) {
                   console.log("Cr.Turning Power On");
                    this.power = CircuitPower.ON;
                  console.log("Cr.Power On");
                }
                else {
                    this.power = CircuitPower.OFF;
                  console.log("Cr.Power Off");
                    }
            }
           //console.log("Done Checking Power");
        }
        else {//console.log("Circuit was Null");}
        }
    }
} 