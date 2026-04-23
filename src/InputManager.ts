import { GameAction } from "./GameAction";
/*
 * this class checks different inputs and game actions throughout the game
 */
export class InputManager {
    actions: {[key: string]: GameAction};

    constructor() {
        this.actions={};
    }

    /**
     * this sets certain keycodes to certain actions within the  game
     */
    setGameAction(action:GameAction, keyCode:number) {
        this.actions[keyCode]=action;
    }
    /*
     * this removes certain keycodes from certain actions within the game
     */
    clearGameAction(keyCode:number) {
        this.actions[keyCode]=null;
    }
    /*
     * this resets all the initial game actions to their original state
     */
    reset() {
        for (const keyCode in this.actions) {
            if (Object.prototype.hasOwnProperty.call(this.actions, keyCode)) {
                this.actions[keyCode].reset();
            }
        }
    }
    /*
     * this checks to see what key is pressed by the user, and it updates the game
     * according to which key is pressed
     */
    checkInput() {
        for (const keyCode in this.actions) {
            if (Object.prototype.hasOwnProperty.call(this.actions, keyCode)) {
                const action = this.actions[keyCode];
                if (keyIsDown(Number(keyCode))) {
                    this.actions[keyCode].press();
                } else {
                    this.actions[keyCode].release();
                }
                
            }
        }
    }
}