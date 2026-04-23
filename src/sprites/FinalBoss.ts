import { Creature, CreatureState } from "./Creature.js";
import { GameMap } from "../GameMap.js";
import { EnemyProjectile } from "./Projectile";

export class FinalBoss extends Creature {
    
    spitFollows:boolean;
    spitInterval:number; //#maximum milliseconds between spits
    lastSpitTime:number;
    numLives:number;

    constructor() {
        super();
        this.spitFollows=true;
        this.spitInterval=1000;
        this.lastSpitTime=0;
        this.numLives=2;
    }

    changeSpitFollows(newVal:boolean) {
        this.spitFollows=newVal;
    }

    effectMap(map:GameMap) {
        if (this.state==CreatureState.NORMAL) {
            //randomly move to a new location with low probability
            if (Math.random()<0.005) {
                this.position.x=Math.random()*map.tilesToPixels(map.width-1);
                this.position.y=Math.random()*map.tilesToPixels(map.height-1);    
            }
            let r=Math.random();
            let diffTime=this.stateTime-this.lastSpitTime;
            if (Math.random()<Math.pow(diffTime/this.spitInterval,2)) {
                let g:EnemyProjectile;
                if (this.spitFollows && Math.random()>0.85) {
                    //need an advanced goo class that knows how to follow
                    g=map.resources.get('goo2').clone();
                    g.setFollowPlayer();
                } else {
                    g=map.resources.get('goo').clone();
                }
                if (Math.random()>0.5) {
                    //left claw
                    g.setPosition(this.position.x,this.position.y);
                } else {
                    //right claw
                    g.setPosition(this.position.x+50,this.position.y);
                }
                let vec=p5.Vector.random2D().mult(0.35);
                //a quarter of the time aim for the player
                if (Math.random()<0.25) {
                    vec=p5.Vector.sub(map.player.getPosition(),g.getPosition());
                    vec.normalize().mult(0.35);
                }
                g.setVelocity(vec.x,vec.y);
                map.sprites.push(g);
                this.lastSpitTime=this.stateTime;
            }
        }
    }

    update(deltaTime:number) {
        console.log("IN FINALBOSS UPDATE");
        super.update(deltaTime);
        if (this.state==CreatureState.DEAD) {
            console.log("DECREMENTING LIVES");
            this.numLives--;
            if (this.numLives>0) {
                console.log("SETTING STATE BACK TO NORMAL");
                this.state=CreatureState.NORMAL;
                this.setAnimation("left");
            }
        }  
    }

}