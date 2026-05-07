/**
 * A station is an object in the game that takes circuits and gates as inputs.
 */

import { Sprite } from "./Sprite.js";


export enum StationState { ON, OFF }; 

export class Station extends Sprite {

    protected state: number;

    constructor() { 
        super();
        this.state=StationState.OFF;
        
    }
        
    changeState(initialState: number) {
        switch (initialState) {
            case StationState.ON: {
                this.state=StationState.ON;
                this.setAnimation("siwtch_on");
                break;
            }
            case StationState.OFF: {
                this.state=StationState.OFF;
                this.setAnimation("switch_off");
                break;
            }
        }
    }
    getState() {
        return this.state;
    }
}
