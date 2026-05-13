import { EnergyTerminal } from "./EnergyTerminal.js";
import { Star } from "./PowerUp.js";
import { Station, StationState } from "./Station.js";

export enum CircuitState {EXTRA, START, END };

export enum CircuitNumber { ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE };

export enum CircuitPower { FILLER, ON, OFF };

export class Circuit extends Star {

    protected state: number;
    protected power: number;
    protected number: number;
    protected locked: boolean;
    protected placed: boolean;
    protected source: Circuit | Station | EnergyTerminal | null;

    constructor() {
        super();
        this.locked = false;
        this.placed = false;
        this.power = CircuitPower.OFF;
    }
    changeState(initialState: number, initialNumber: number) {
        switch (initialState) {
            case CircuitState.START: {
                this.state = CircuitState.START;
                switch (initialNumber) {
                    case CircuitNumber.ONE: {
                    this.number = CircuitNumber.ONE;
                    this.setAnimation("one_start");
                    break;
                    }
                    case CircuitNumber.TWO: {
                        this.number = CircuitNumber.TWO;
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
                this.state = CircuitState.END;
                switch (initialNumber) {
                    case CircuitNumber.ONE: {
                    this.number = CircuitNumber.ONE;
                    this.setAnimation("one_end");
                    break;
                    }
                    case CircuitNumber.TWO: {
                        this.number = CircuitNumber.TWO;
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
    getNumber() {
        if (this.number == CircuitNumber.ZERO) {
                return "zero";
            } 
        else if (this.number == CircuitNumber.ONE) {
            return "one";
        } 
        else if (this.number == CircuitNumber.TWO) {
            return "two";
        } 
        else if (this.number == CircuitNumber.THREE) {
            return "three";
        } 
        else if (this.number == CircuitNumber.FOUR) {
            return "four";
        } 
        else if (this.number == CircuitNumber.FIVE) {
            return "five";
        } 
        else if (this.number == CircuitNumber.SIX) {
            return "six";
        } 
        else if (this.number == CircuitNumber.SEVEN) {
            return "seven";
        } 
        else if (this.number == CircuitNumber.EIGHT) {
            return "eight";
        } 
        else if (this.number == CircuitNumber.NINE) {
            return "nine";
        } 
        
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
        //s.removePower();
        this.power = s.getPower();
    }
    syncEnergy(t: EnergyTerminal) {
        this.source = t;
        this.power = CircuitPower.ON;
    }
    unsyncEnergy(t: EnergyTerminal) {
        this.source = null;
        this.power = CircuitPower.OFF;
    }
    addPower () {
        this.power = CircuitPower.ON;
    }
    removePower () {
        this.power = CircuitPower.OFF;
    }
    checkPower() {
       console.log("Checking Power");
        if (this.source != null) {
           //console.log("This Power Source Not Null");
            if (this.source instanceof Station) {
                if ((this.source as Station ).getState() == StationState.ON) {
                   console.log("St.Turning Power On: " + this.getNumber());
                    this.power = CircuitPower.ON;
                  //console.log("St.Power On");
                }
                else {
                    this.power = CircuitPower.OFF;
                  console.log("St.Power Off: " + this.getNumber());
                    }
            } else if (this.source instanceof Circuit) {
                    if (((this.source as Circuit).source instanceof EnergyTerminal)) {
                        console.log("Cr.Turning Power On Circuit: " + this.getNumber());
                        this.power = CircuitPower.ON;
                    }
                    else {this.power = CircuitPower.OFF
                        console.log("Cr.Power Off Circuit: " + this.getNumber());
                    }
            }
           //console.log("Done Checking Power");
        }
        else {
            console.log("Circuit was Null");
            this.power = CircuitPower.OFF;
        }
    }
    
} 