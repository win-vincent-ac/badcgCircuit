import { Star } from "./PowerUp.js";

export enum GateState { AND, OR, NOT };

export class Gate extends Star {

    protected state: number;

    constructor() {
        super();
        // switch (initialState) {
        //     case GateState.AND: {
        //         this.state=GateState.AND;
        //         this.currAnimName = "and";
        //         this.setAnimation("and");
        //         break;
        //     }
        //     case GateState.OR: {
        //         this.state=GateState.OR;
        //         this.currAnimName = "or";
        //         break;
        //     }
        //     case GateState.NOT: {
        //         this.state=GateState.NOT;
        //         this.currAnimName = "not";
        //         break;
        //     }
        // }
    }
    changeState(initialState: number) {
        switch (initialState) {
            case GateState.AND: {
                this.state=GateState.AND;
                this.setAnimation("and");
                break;
            }
            case GateState.OR: {
                this.state=GateState.OR;
                this.setAnimation("or");
                break;
            }
            case GateState.NOT: {
                this.state=GateState.NOT;
                this.setAnimation("not");
                break;
            }
        }
    }
    getState() {
        return this.state;
    }
}