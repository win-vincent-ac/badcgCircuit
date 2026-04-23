const RELEASED=0;
const BEGIN_PRESS=1;
const PRESSED=2;
const END_PRESS=3;

//This class represents different GameActions throughout the game

export class GameAction {
    state:number;

    /*
     * This method initalizes the 'state' of the game to RELEASED
     */
    constructor() {
        this.state=RELEASED;
    }
    /*
     * This method resets the 'state' of the game to RELEASED
     */
    reset() {
        this.state=RELEASED;
    }
    /*
     * this method sets the 'state' of the game to END_PRESS, if the 'state' is BEGIN_PRESS or PRESSED. If it is already END_PRESSED 
     * The 'state' is set to RELEASED
     */
    release() {
        if (this.state==BEGIN_PRESS || this.state==PRESSED)
            this.state=END_PRESS;
        else if (this.state==END_PRESS)
            this.state=RELEASED;
    }
    /*
     * This method sets the 'state' to BEGIN_PRESS, if the current 'state' is RELEASED
     * It also sets the 'state' to PRESSED, if the current 'state' is BEGIN_PRESS
     * It also sets the 'state' to BEGIN_PRESS, if the current 'state' is END_PRESS
     */
    press() {
        if (this.state==RELEASED)
            this.state=BEGIN_PRESS;
        else if (this.state==BEGIN_PRESS)
            this.state=PRESSED;
        else if (this.state==END_PRESS)
            this.state=BEGIN_PRESS;
    }
    /*
     * This method returns true if the current 'state' is BEGIN_PRESS and false otherwise
     */
    isBeginPress():boolean {
        return this.state==BEGIN_PRESS;
    }
    /*
     * This method returns true if the current 'state' is PRESSED, END_PRESS, or BEGIN_PRESS and false otherwise
     */
    isPressed():boolean {
        return this.state==PRESSED || this.state==END_PRESS || this.state==BEGIN_PRESS;
    }
    /*
     * This method returns true if the current 'state' END_PRESS and false otherwise
     */
    isEndPress():boolean {
        return this.state==END_PRESS;
    }

}