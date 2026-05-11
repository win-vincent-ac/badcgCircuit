/**
 * A station is an object in the game that takes circuits and gates as inputs.
 */

import { Gate } from "./Gate.js";
import { Sprite } from "./Sprite.js";


export enum StationState { ON, OFF }; 

export enum CenterState { AND, OR, NOT, EMPTY};

export class Station extends Sprite {

    protected state: number;
    protected inputOneSource: Station;
    protected inputTwoSource: Station;
    protected inputOnePower: boolean;
    protected inputTwoPower: boolean;
    protected center: number;
    protected outputPower; boolean;
    protected outputSource: Station;
    protected isOutput: boolean;
    protected isInput: boolean;

    constructor() { 
        super();
        this.state=StationState.OFF;
        this.inputOnePower = false;
        this.center=CenterState.EMPTY;
        this.outputPower = false;
        this.isOutput = false;
        this.isInput = false;
        
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
                this.center=CenterState.EMPTY;
                this.outputPower = false;
                break;
            }
            case CenterState.AND: {
                this.center=CenterState.AND;
                if(this.inputOnePower && this.inputTwoPower) {
                this.outputPower = true;
                } else {this.outputPower = false;}
                break;
            }
            case CenterState.OR: {
                this.center=CenterState.OR;
                if(this.inputOnePower || this.inputTwoPower) {
                    this.outputPower = true;
                    } else {this.outputPower = false;}
                break;
            }
            case CenterState.NOT: {
                this.center=CenterState.NOT;
                if(!this.inputOnePower) {
                    this.outputPower = true;
                    } else {this.outputPower = false;}
                break;
            }
        }
    }
    checkOutput () {
        //console.log("Checking Output");
        if (this.outputSource != null) {
            //console.log("outputSource is not null");
            if (this.center == CenterState.EMPTY) {
                //console.log("Starting Empty");
                this.outputSource.changeState(StationState.OFF);
                console.log("Empty");
            }
            else if (this.inputOneSource.getState() == StationState.ON && this.inputTwoSource.getState() == StationState.ON && this.center == CenterState.AND) {
                this.outputSource.changeState(StationState.ON);
                console.log("turned on AND");
            }
            else if ((this.inputOneSource.getState() == StationState.ON || this.inputTwoSource.getState() == StationState.ON) && this.center == CenterState.OR) {
                this.outputSource.changeState(StationState.ON);
                console.log("turned on OR");
            }
            else if (this.inputOneSource.getState() == StationState.OFF && this.center == CenterState.NOT) {
                this.outputSource.changeState(StationState.ON);
                console.log("turned on NOT");
            }
            else {
                //console.log("turning off");
                this.outputSource.changeState(StationState.OFF);
                console.log("turned off");
            }
        }
        //console.log("Done Checking Output");
    }

    getState() {
        return this.state;
    }

    syncInputOne(s1: Station) {
        this.inputOneSource = s1;
        s1.makeInput();
    }
    syncInputTwo(s2: Station) {
        this.inputTwoSource = s2;
        s2.makeInput();
    }
    syncOutput(s3: Station) {
        this.outputSource = s3;
        s3.makeOutput();
    }

    makeInput() {
        this.isInput = true;
    }
    makeOutput() {
        this.isOutput = true;
    }

    checkingIsOutput() {
        return this.isOutput;
    }
    checkingIsInput() {
        return this.isInput;
    }
}
