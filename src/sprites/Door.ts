import { PowerUp } from "./PowerUp.js";
import { GameManager } from "../GameManager.js";

export class Door extends PowerUp {

    open: boolean = false;
    levelOpened: boolean = false;
    man:GameManager;

    openDoor(){
        this.open = false;
        this.levelOpened = true;
        this.man.doorOpen = true;
        this.setAnimation("open");
    }

    closedDoor(){
        this.open = false;
        this.levelOpened = false;
        this.man.doorOpen = false;
        this.setAnimation("default");
    }

    isOpen():boolean {
        return this.open;
    }
}

