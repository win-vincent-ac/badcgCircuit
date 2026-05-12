import { PowerUp } from "./PowerUp.js";

export class Door extends PowerUp {

    open: boolean = false;
    levelOpened: boolean = false;

    openDoor(){
        this.open = false;
        this.levelOpened = true;
        this.setAnimation("open");
    }

    closedDoor(){
        this.open = false;
        this.levelOpened = false;
        this.setAnimation("default");
    }

    isOpen():boolean {
        return this.open;
    }
}

