/**
 * Energy Terminal Powers Any Start in it
 */
import { Circuit } from "./Circuit.js";
import { Sprite } from "./Sprite.js";


export class EnergyTerminal extends Sprite {

    protected pathway: Circuit;

    constructor() { 
        super();
        this.setAnimation("default");
      //console.log("Energy");
    }
    
    checkEnergy () {
      //console.log("Checking Energy");
        if (this.pathway != null) {
            //console.log("outputSource is not null");
            (this.pathway as Circuit).addPower();
        }
        else {
            //(this.pathway as Circuit).removePower();
        }
        //console.log("Done Checking Output");
}
    syncPathway(c: Circuit) {
        this.pathway = c;
    }
    unsyncPathway(c: Circuit) {
        this.pathway = null;
    }
    getPathway() {
        return this.pathway;
    }

}
