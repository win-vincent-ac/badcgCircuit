/**
 * Door to exit level
 */

import { timeStamp } from "console";
import { Sprite } from "./Sprite.js";
import { Station, StationState } from "./Station.js";


export enum DoorState { NONE, OPEN, CLOSED }; 

export class Door extends Sprite {

    protected open: number;
    protected levelOpened: boolean;
    protected source: Station;

    constructor() {
        super();
        this.open = DoorState.CLOSED;
        this.levelOpened = false;
    }

    openDoor(){
        this.open = DoorState.OPEN;
        this.levelOpened = true;
        this.setAnimation("open");
    }

    closedDoor(){
        this.open = DoorState.CLOSED;
        this.levelOpened = false;
        this.setAnimation("default");
    }

    isOpen() {
        return this.open;
    }

    checkDoor() {
        console.log("Checking Door");
        console.log("Open: " + this.open);
        console.log("LevelOpened: " + this.levelOpened);
        console.log("Source" + this.source);
        if (this.source.isToDoor()){
            if (this.source.shouldDoorOpen) {
                this.openDoor();
            }
            else {
                this.closedDoor();
            }
        }
    }

    syncDoorStation(s: Station) {
        console.log("Door Synced to Station");
        this.source = s;
        s.makeToDoor();
    }

}

