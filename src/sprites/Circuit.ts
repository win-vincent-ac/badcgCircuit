import { Star } from "./PowerUp.js";

export enum CircuitState { START, END };

export enum CircuitNumber { ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE };

export enum CircuitPower { ON, OFF };

export class Circuit extends Star {

    protected state: number;
    protected power: number;
    protected number: number;
    protected locked: boolean;
    protected placed: boolean;
    protected source: Circuit;

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
    checkPower() {
     if (this.source.getPower() == CircuitPower.ON) {
          this.power = CircuitPower.ON;
     }
    }
}