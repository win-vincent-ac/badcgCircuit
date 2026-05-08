/**
 * A station is an object in the game that takes circuits and gates as inputs.
 */

import { Gate } from "./Gate.js";
import { Sprite } from "./Sprite.js";


export enum StationState { ON, OFF }; 

export enum CenterState { AND, OR, NOT, EMPTY};

export class Station extends Sprite {

    protected state: number;
    //protected inputOneSource: Circuit;
    protected inputOnePower: boolean;
    protected inputTwoPower: boolean;
    protected center: number;
    protected outputPower; boolean;

    constructor() { 
        super();
        this.state=StationState.OFF;
        this.inputOnePower = false;
        this.center=CenterState.EMPTY;
        this.outputPower = false;
        
    }
    changeState(initialState: number) {
        switch (initialState) {
            case StationState.ON: {
                this.state=StationState.ON;
                this.setAnimation("on");
                break;
            }
            case StationState.OFF: {
                this.state=StationState.OFF;
                this.setAnimation("off");
                break;
            }
        }
    }
    changeCenter(initialState: number) {
        switch (initialState) {
            case CenterState.EMPTY: {
                this.state=StationState.OFF;
                this.outputPower = false;
                break;
            }
            case CenterState.AND: {
                if(this.inputOnePower && this.inputTwoPower) {
                this.outputPower = true;
                } else {this.outputPower = false;}
                break;
            }
            case CenterState.OR: {
                if(this.inputOnePower || this.inputTwoPower) {
                    this.outputPower = true;
                    } else {this.outputPower = false;}
                break;
            }
            case CenterState.NOT: {
                if(!this.inputOnePower) {
                    this.outputPower = true;
                    } else {this.outputPower = false;}
                break;
            }
        }
    }
    getState() {
        return this.state;
    }
}
