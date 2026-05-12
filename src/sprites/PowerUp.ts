import { Sprite } from "./Sprite.js";

export class PowerUp extends Sprite {

}

export class Star extends PowerUp {

}

export class Music extends PowerUp {

}

export class Heart extends PowerUp {
    
}

export class Door extends PowerUp {
    protected open: boolean;

    constructor() {
        super();
        this.open = false;
    }
    toggleDoor() {
        this.open = !this.open;
        //IF exit circuit HAS POWER OPEN
        //IF exit circuit NOT HAS POWER CLOSE
    }
    isOpen() {
        return this.open;
    }
}

export class Power extends PowerUp {
    
}
