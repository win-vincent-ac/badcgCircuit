/**
 * Door to exit level
 */

import { Sprite } from "./Sprite.js";
import { Station, StationState } from "./Station.js";
import { GameMap } from "../GameMap.js";
import { Player } from "./Player.js";


export enum DoorState { NONE, OPEN, CLOSED }; 

export class Door extends Sprite {

    protected open: number;
    protected levelOpened: boolean;
    protected source: Station;
    protected mappy: GameMap; //the current state of the game

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
        console.log("Error about to happen vvv");
        
        console.log("Error passed ^^^");
        if (this.source.shouldDoorOpen()){  
            this.open = DoorState.OPEN;
            this.levelOpened = true;
            this.setAnimation("open");
            }
        else {
            this.open = DoorState.CLOSED;
            this.levelOpened = false;
            this.setAnimation("default");
        }
        
    }

    syncDoorStation(s: Station) {
        console.log("Door Synced to Station");
        this.source = s;
        s.makeToDoor();
    }

}

