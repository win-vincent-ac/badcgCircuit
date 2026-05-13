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
        this.setAnimation("zero_start");
    }
    changeState(initialState: number, initialNumber: number) {
        switch (initialState) {
            case CircuitState.START: {
                this.state = CircuitState.START;
                this.setAnimation("zero_start");
                switch (initialNumber) {
                    case CircuitNumber.ZERO: {
                        this.setAnimation("and"); // basic block form
                    break;
                }
                    case CircuitNumber.ONE: {
                    this.number = CircuitNumber.ONE;
                        this.setAnimation("one_start"); // basic block form
                    break;
                }
                case CircuitNumber.TWO: {
                    this.number = CircuitNumber.TWO;
                        this.setAnimation("two_start"); // basic block form
                    break;
                }
                    case CircuitNumber.THREE: {
                    this.number = CircuitNumber.THREE;
                        this.setAnimation("three_start"); // basic block form
                    break;
                }
                case CircuitNumber.FOUR: {
                    this.number = CircuitNumber.FOUR;
                        this.setAnimation("four_start"); // basic block form
                    break;
                }
                    case CircuitNumber.FIVE: {
                    this.number = CircuitNumber.FIVE;
                        this.setAnimation("five_start"); // basic block form
                    break;
                }
                case CircuitNumber.SIX: {
                    this.number = CircuitNumber.SIX;
                        this.setAnimation("six_start"); // basic block form
                    break;
                }
                    case CircuitNumber.SEVEN: {
                    this.number = CircuitNumber.SEVEN;
                        this.setAnimation("seven_start"); // basic block form
                    break;
                }
                case CircuitNumber.EIGHT: {
                    this.number = CircuitNumber.EIGHT;
                        this.setAnimation("eight_start"); // basic block form
                    break;
                }
                    case CircuitNumber.NINE: {
                    this.number = CircuitNumber.NINE;
                        this.setAnimation("nine_start"); // basic block form
                    break;
                }
            }
            break;
        }
            case CircuitState.END: {
                this.state = CircuitState.END;
                this.setAnimation("zero_end");
                switch (initialNumber) {
                    case CircuitNumber.ZERO: {
                    this.number = CircuitNumber.ZERO;
                        this.setAnimation("zero_end"); // basic block form
                    break;
                }
                    case CircuitNumber.ONE: {
                    this.number = CircuitNumber.ONE;
                        this.setAnimation("one_end"); // basic block form
                    break;
                }
                case CircuitNumber.TWO: {
                    this.number = CircuitNumber.TWO;
                        this.setAnimation("two_end"); // basic block form
                    break;
                }
                    case CircuitNumber.THREE: {
                    this.number = CircuitNumber.THREE;
                        this.setAnimation("three_end"); // basic block form
                    break;
                }
                case CircuitNumber.FOUR: {
                    this.number = CircuitNumber.FOUR;
                        this.setAnimation("four_end"); // basic block form
                    break;
                }
                    case CircuitNumber.FIVE: {
                    this.number = CircuitNumber.FIVE;
                        this.setAnimation("five_end"); // basic block form
                    break;
                }
                case CircuitNumber.SIX: {
                    this.number = CircuitNumber.SIX;
                        this.setAnimation("six_end"); // basic block form
                    break;
                }
                    case CircuitNumber.SEVEN: {
                    this.number = CircuitNumber.SEVEN;
                        this.setAnimation("seven_end"); // basic block form
                    break;
                }
                case CircuitNumber.EIGHT: {
                    this.number = CircuitNumber.EIGHT;
                        this.setAnimation("eight_end"); // basic block form
                    break;
                }
                    case CircuitNumber.NINE: {
                    this.number = CircuitNumber.NINE;
                        this.setAnimation("nine_end"); // basic block form
                    break;
                }
                }
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
        return this.number;
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
    addPower() {
        this.power = CircuitPower.ON;
    }
    removePower() {
        this.power = CircuitPower.OFF;
    }
    checkPower() {
       //console.log("Checking Power");
        if (this.source != null) {
           //console.log("This Power Source Not Null");
            if (this.source instanceof Station) {
                if ((this.source as Station ).getState() == StationState.ON) {
                   //console.log("St.Turning Power On: " + this.getNumber());
                    this.power = CircuitPower.ON;
                  //console.log("St.Power On");
                }
                else {
                    this.power = CircuitPower.OFF;
                  //console.log("St.Power Off: " + this.getNumber());
                    }
            } else if (this.source instanceof Circuit) {
                    if (((this.source as Circuit).source instanceof EnergyTerminal)) {
                        //console.log("Cr.Turning Power On Circuit: " + this.getNumber());
                        this.power = CircuitPower.ON;
                    }
                    else {this.power = CircuitPower.OFF
                        //console.log("Cr.Power Off Circuit: " + this.getNumber());
                    }
            }
           //console.log("Done Checking Power");
        }
        else {
            //console.log("Circuit was Null");
            this.power = CircuitPower.OFF;
        }
    }
    
} 