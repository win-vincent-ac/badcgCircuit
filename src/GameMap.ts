import { Player } from "./sprites/Player.js";
import { ResourceManager } from "./ResourceManager.js";
import { Sprite } from "./sprites/Sprite.js";
import { GRAVITY, STATE, GameManager } from './GameManager.js';
import { Creature, CreatureState, Grub } from "./sprites/Creature.js";
import { Door,Heart, Music, PowerUp, Star} from "./sprites/PowerUp.js";
import { Projectile, EnemyProjectile } from './sprites/Projectile.js';
import { Lava } from "./sprites/Lava.js"
import { Settings } from "./Settings.js";
import { Gate, GateState } from "./sprites/Gate.js";
import { CenterState, Station, StationState } from "./sprites/Station.js";
import { Vector } from "p5";
import { Circuit, CircuitState, CircuitPower, CircuitNumber } from "./sprites/Circuit.js";

/*
 * This class controls the main actions of the game for the player and the sprites
 */
export class GameMap {

    tiles: p5.Image[][];
    tile_size:number;
    sprites: Sprite[];
    gates: Sprite[];
    player: Player;
    background: p5.Image[];
    width: number; // width in tiles
    height: number; // height in tiles
    level: number;
    resources: ResourceManager;
    game: GameManager;
    settings: Settings;
    prize: p5.SoundFile;
    music: p5.SoundFile;
    boop: p5.SoundFile;
    robot_temp: p5.SoundFile;
    black_hole: p5.SoundFile;
    dying: p5.SoundFile;
    robot_jump: p5.SoundFile;
    full_death: p5.SoundFile;
    medallions: number;
    ALPHALEVEL: number;
    lives: number;
    oneUp: p5.SoundFile;
    heldMedallion: Star | null = null;
    hWasDown: boolean = false;
    robot_death: p5.SoundFile;
    robot_pickup: p5.SoundFile;
    robot_walk: p5.SoundFile;
    robot_putdown: p5.SoundFile;

    constructor(level:number, resources:ResourceManager, settings:Settings, game: GameManager) {
    /*
     * This initializes different aspects of the game
     */    
        this.ALPHALEVEL=20;
        this.settings=settings;
        this.level=level;
        this.resources=resources;
        this.medallions=0;
        this.lives=3;
        this.game=game;
        this.initialize();
    }

    initialize() {
        this.oneUp=this.resources.getLoad("1up");
        this.prize=this.resources.getLoad("prize");
        this.music=this.resources.getLoad("music");
        this.boop=this.resources.getLoad("boop2");
        this.full_death=this.resources.getLoad("full_death");
        this.black_hole=this.resources.getLoad("blackHole");
        this.dying = this.resources.getLoad("dying");
        this.robot_jump=this.resources.getLoad("robot_jump");
        this.robot_temp=this.resources.getLoad("robot_temp");
        this.robot_death=this.resources.getLoad("robot_death");
        this.robot_pickup=this.resources.getLoad("robot_pickup");
        this.robot_walk=this.resources.getLoad("robot_walk");
        this.robot_putdown=this.resources.getLoad("robot_putdown");
        /*
         * These initialze arrays to store sprites and backgrounds 
         */
        this.sprites=[];
        this.background=[];
        /*
         * These get the tile size and the level map data
         */
        this.tile_size=this.resources.get("TILE_SIZE");
        let mappings=this.resources.get("mappings");
        let map=this.resources.getLoad(this.resources.get("levels")[this.level]);

        if (!map) {
            this.level=0;
            this.game.gameState=STATE.Finished;
            map=this.resources.getLoad(this.resources.get("levels")[this.level]);
        }
        /*
         * The analyze the level data and draw the sprites, tiles, 
         */
        let lines=[];
        let width=0;
        let height=0;

        //going through each line in the map text file
        map.forEach(line => {
            if (!line.startsWith("#")) { //ignoring commented lines
                if (line.startsWith("@")) {
                    let parts=line.split(" ");
                    switch (parts[0]) {
                        case "@parallax-layer": {
                            //loads background images
                            this.background.push(this.resources.getLoad(parts[1]));
                            break;
                        }
                        /**
                         * this loads the music
                         */
                        case "@music": {
                            this.music=this.resources.getLoad(parts[1]);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                } else { //this pushed the rest of the file to read in the foreground tiles/characters
                    lines.push(line);
                    width = Math.max(width,line.length); //determining the width of the map based on max length of line
                }
            }
        });

        /*
         * Calculates the level height and width based on the analyzed level data 
         */
        height=lines.length;
        this.width=width;
        this.height=height;
        
        /*
         * creates 2D tile array to assign tiles and sprites based on the analyzed level, sprite and tiles data
         */
        this.tiles=[...Array(width)].map(x=>Array(height)) 
        

        for(let y=0; y<height; y++) {
            let line=lines[y];
            for (let x=0; x<line.length; x++) {
                let ch = line.charAt(x);
                if (ch===" ") continue;
                //tiles are A-Z, sprites are a-z, 0-9, and special characters
                if (ch.match(/[A-Z]/)) { 
                    this.tiles[x][y]=this.resources.get(ch);
                } else {//it's a sprite
                    let s = this.resources.get(mappings[ch]).clone();
                    s.setPosition(this.tilesToPixels(x)+this.tile_size-s.getImage().width/2,
                                  this.tilesToPixels(y)+this.tile_size-s.getImage().height);
                                  
                    if (ch=='0') { // check if character is '0', which denotes the player sprite
                        this.player=s; // assign the sprite to the 'player' variable
                    } 
                    else if (ch=='$' || ch=='m') { // check if character is '$' or 'm', which denotes the stations
                        this.sprites.unshift(s);
                    }
                    else {
                        this.sprites.push(s); // otherwise, add the sprite to the 'sprites' array
                    }
                }
            }
        }
        
        //LEVEL DESIGN FOR GATES, STATIONS, CIRCUITS
        //All stations will be drawn first as sprites[i] and end as sprites[0], Read them right to left
        //after all stations are drawn, then gates and other sprites are drawn at sprites[i+1], read left to right
        if (this.level == 0) {
            (this.sprites[3] as Station).changeState(StationState.OFF);
            
            (this.sprites[2] as Station).changeState(StationState.OFF);
            (this.sprites[1] as Station).changeState(StationState.OFF);
            (this.sprites[1] as Station).syncInputOne((this.sprites[3] as Station));
            (this.sprites[1] as Station).syncInputTwo((this.sprites[2] as Station));
            (this.sprites[1] as Station).syncOutput((this.sprites[0] as Station));
            (this.sprites[0] as Station).changeState(StationState.OFF);

            //(this.sprites[0] as Station).connectOne(this.sprites[4]); <<<Possible example of changing connections
            (this.sprites[4] as Gate).changeState(GateState.AND);
            (this.sprites[5] as Gate).changeState(GateState.NOT);
            (this.sprites[6] as Gate).changeState(GateState.OR);

            (this.sprites[7] as Circuit).changeState(CircuitState.START, CircuitNumber.ONE);
            (this.sprites[8] as Circuit).changeState(CircuitState.END, CircuitNumber.ONE);
        
        }

    }

    

    /*
     * Convert tile position to pixel position
     */
    tilesToPixels(x:number):number {
        return Math.floor(x*this.tile_size);
    }
    /*
     * Convert pixel position to tile position
     */
    pixelsToTiles(x:number):number {
        return Math.floor(x/this.tile_size);
    }
    /*
     * this method calls upon the draw function and it draws a bunch of the images 
     * within the game 
     */
    draw() {
    
        /*
         * These define the screen demension
         */
        let myW=800;
        let myH=600;
        
        let mapWidth=this.tilesToPixels(this.width);
        let mapHeight = this.tilesToPixels(this.height);
        let position=this.player.getPosition();
        
        let offsetX = myW / 2 - Math.round(position.x) - this.tile_size;
        offsetX = Math.trunc(Math.max(offsetX, myW - mapWidth));
        let offsetY = myH / 2 - Math.round(position.y) - this.tile_size;
        offsetY = Math.trunc(Math.max(offsetY, myH - mapHeight));
               
        this.background.forEach(bg => {
            let x = Math.trunc(offsetX * (myW - bg.width)/(myW-mapWidth));
            let y = Math.trunc(offsetY * (myH - bg.height)/(myH-mapHeight)); 
            image(bg,0,0,myW,myH,0-x,0-y,800,600); 
        });
        /*
         * These lines of code creates the tiles of the video game that are visible
         */
        let firstTileX = Math.trunc(this.pixelsToTiles(-offsetX));
        let lastTileX = Math.trunc(firstTileX + this.pixelsToTiles(myW) + 1);
        for (let y = 0; y < this.height; y++) {
            for(let x=firstTileX; x <= lastTileX; x++) {
                if (this.tiles[x] && this.tiles[x][y]) { 
                    image(this.tiles[x][y], 
                        this.tilesToPixels(x) + offsetX,
                        this.tilesToPixels(y) + offsetY);
                }
            }
        }
        /*
         * These lines of code creates the player and its position
         */
        image(this.player.getImage(),
            Math.trunc(Math.trunc(position.x) + offsetX),
            Math.trunc(Math.trunc(position.y) + offsetY));

         // This is going to highlight the medallions and detect if they are within the player's radius
         // - Liv
            const nearbyMedallion = this.getNearbyMedallion(120);

        this.sprites.forEach((sprite) => {
        const p = sprite.getPosition();
        const img = sprite.getImage();

        if (!img) return;

            image(
                img,
                 Math.trunc(p.x + offsetX),
                Math.trunc(p.y + offsetY));

         if (sprite === nearbyMedallion) { 
            noFill();
            if (this.heldMedallion == null) {stroke(255, 255, 255);}
            else { stroke(255, 255, 255, 0);}
            strokeWeight(3);

         ellipse(
            Math.trunc(p.x + offsetX + img.width / 2),
            Math.trunc(p.y + offsetY + img.height / 2),
            img.width + 0,
            img.height + 0
        );

            strokeWeight(1);
            noStroke();
    
        };

        if (sprite === nearbyMedallion) { 
            noFill();
            if (this.heldMedallion == null) {stroke(255, 255, 255);}
            else { stroke(255, 255, 255, 0);}
            strokeWeight(1);

         ellipse(
            Math.trunc(p.x + offsetX + img.width / 2),
            Math.trunc(p.y + offsetY + img.height / 2),
            img.width + 10,
            img.height + 10
        );

            strokeWeight(1);
            noStroke();
    
        };
    
        /* OLD CODE (not needed)
         * These lines of codes draws every other sprite (fly) in the game
         */
        this.sprites.forEach(sprite => {
            let p=sprite.getPosition();
            image(sprite.getImage(),
                Math.trunc(Math.trunc(p.x) + offsetX),
                Math.trunc(Math.trunc(p.y) + offsetY));

        /*
         * These lines of code creates the player and its position
         */
        image(this.player.getImage(),
            Math.trunc(Math.trunc(position.x) + offsetX),
            Math.trunc(Math.trunc(position.y) + offsetY));
        /*
         * This if statement says if the sprites are visible on the screen, they move
         * if they aren't visible they stay still until they are on the screen 
         */
            if (sprite instanceof Creature && p.x+offsetX> 0 && p.x+offsetX<myW) {
                sprite.wakeUp();
            }
        });
    }
)}

    /*
     * This method checks to see if there is a collision between the sprites
     * It returns a boolean if they collide or not
     */
    isCollision(s1:Sprite,s2:Sprite):boolean {
        if (s1==s2) return false;
        if (s1 instanceof Creature && (s1 as Creature).getState()!=CreatureState.NORMAL) return false;
        if (s2 instanceof Creature && (s2 as Creature).getState()!=CreatureState.NORMAL) return false;

        let pos1=s1.getPosition().copy();
        let pos2=s2.getPosition().copy();
        pos1.x=Math.round(pos1.x);
        pos1.y=Math.round(pos1.y);
        pos2.x=Math.round(pos2.x);
        pos2.y=Math.round(pos2.y);
        
        let i1=s1.getImage();
        let i2=s2.getImage();
        
        /* was (-) changed to (+) checks if bounding box overlaps for collision detection */
        let val = (pos1.x < pos2.x + i2.width &&
            pos2.x < pos1.x + i1.width &&
            pos1.y < pos2.y + i2.height &&
            pos2.y < pos1.y + i1.height);
        return val;
    }

    /*
     * This methods checks to see if s(sprite) collides with another sprite in the sprite array list
     * if there is a collision, it returns the collided sprite,
     * if there isn't a collision, it returns null
     */
    getSpriteCollision(s:Sprite):Sprite {
        for (const other of this.sprites) {
            if (this.isCollision(s,other)) {
                return other;
            }
        }
        return null;
    }

    // this checks if there is a medallion within the radius of the play and will higlight the medallion signalling
    // that it can be picked up
    getNearbyMedallion(radius: number): Star | null {
    const playerPos = this.player.getPosition();
    const playerImg = this.player.getImage();

    if (!playerImg) return null;

    const playerCenterX = playerPos.x + playerImg.width / 2;
    const playerCenterY = playerPos.y + playerImg.height / 2;

    for (let sprite of this.sprites) {
        if (sprite instanceof Star) {
            const spritePos = sprite.getPosition();
            const spriteImg = sprite.getImage();

            if (!spriteImg) continue;

            const spriteCenterX = spritePos.x + spriteImg.width / 2;
            const spriteCenterY = spritePos.y + spriteImg.height / 2;

            const dx = playerCenterX - spriteCenterX;
            const dy = playerCenterY - spriteCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= radius) {
                return sprite;
            }
        }
    }

    return null;
}
    /*
     * This checks to see if there is a player collision with a sprite and it initializes
     * that the player can kill the sprite
     */
    checkPlayerCollision(p: Player, canKill: boolean) {
        if (p.getState()!=CreatureState.NORMAL) return;
        let s=this.getSpriteCollision(p);
        if (s && this.pp_collision(p,s)) {
            if (s instanceof Creature || s instanceof EnemyProjectile) {
                if(this.lives==1){
                    p.setState(CreatureState.DYING)
                    this.robot_death.play();
                    this.level=0;
                    this.medallions=0;
                    this.lives+=3;
                }
                if(this.lives>1){
                    p.setState(CreatureState.DYING);
                    this.robot_death.play();
                    this.medallions=0;
                    this.lives-=1;
                }                
            }   
            else if (s instanceof Lava) {
                p.setState(CreatureState.DYING);
                this.robot_death.play();
                this.medallions=0;
            } 
            else if (s instanceof PowerUp) {
                if (s instanceof Star) {
                    return;
                }
                this.acquirePowerUp(s);
            }
        }
    }
    
    removeSprite(s:Sprite) {
        // medallions should only be collected/held when h is pressed
        if (s instanceof Star && !keyIsDown(72)) {
            return;
        }
        this.acquirePowerUp (s);
        
    }

    /*
     * This method checks to see if the player aquires a power up or not. 
     * @param p 
     */
    acquirePowerUp(p:PowerUp) {
        /*
         * this removes the sprite 'p' 
         */
        /*
         * this if loop checks to see if 'p' is in instance of star
         */
        if (p instanceof Star) {
        this.removeSprite(p);
            /*
             * this if loop states that if the player collects a star, the medallion count increases by 1
             * there will be an event sound that plays as well
             */
            if (this.settings.playEvents) {
                this.robot_pickup.play();
            }
            this.medallions+=1;
        }
        /*
            * this else if checks to see if 'p' is in instance of a Heart
            */
        else if (p instanceof Door) {
            /*
             * the if loop states that if the level is 0 and you have 10 medaillions, you can proceed to the next level
             * and the sound black_hole will play
             * if you don't have 9 medaillions then you cannot proceed to the next level
             */
            if(this.level==0 && this.medallions==10) {
                /* Start animation for changing door open close */
                this.black_hole.play();
                this.level+=1;
                this.medallions=0;
                this.initialize();
                this.removeSprite(p);
            }
            // door code
            /*
            * the if loop states that if the level is 1 and you have 20 medaillions, you can proceed to the next level
            * and the sound black_hole will play
            * if you don't have 20 medaillions then you cannot proceed to the next level
            */
            if(this.level==1 && this.medallions==10) {
                this.black_hole.play();
                this.level+=1;
                this.medallions=0;

                this.initialize();
                this.removeSprite(p);
            }
        } 
        /*
        * this checks to see if 'p' is instance of PowerUp
        * then it checks to see if you collected this PowerUp
        * if you did, and your lives are greater than 0,
        * it adds a life to your number of lives you have
        * then the sound file oneUp plays once you collect it
        */
        else if (p instanceof PowerUp) {
            if(this.lives>0){
                this.oneUp.play();
                this.lives+=1;
            }
        }
    }

    /*
     * This method checks collisions between the sprites and the tiles throughout the levels
     */
    getTileCollision(s:Sprite, newPos:p5.Vector) {
        let oldPos=s.getPosition();
        /*
         * these calculate sprites bounding boxes for 
         * their new and old positions
         */
        let fromX = Math.min(oldPos.x,newPos.x);
        let fromY = Math.min(oldPos.y,newPos.y);
        let toX = Math.max(oldPos.x,newPos.x);
        let toY = Math.max(oldPos.y,newPos.y);

        let fromTileX = this.pixelsToTiles(fromX);
        let fromTileY = this.pixelsToTiles(fromY);
        let toTileX = this.pixelsToTiles(toX + s.getImage().width-1);
        let toTileY = this.pixelsToTiles(toY + s.getImage().height -1);

        for(let x=fromTileX; x<=toTileX; x++) {
            for(let y=fromTileY;y<=toTileY;y++) {
                if (x<0 || x >= this.tiles.length || this.tiles[x][y]) {
                    return createVector(x,y);
                }
            }
        }
        
        return null;
    }
    
    /*
     * This method updates the sprites based on deltaTime and gravity
     */
    updateSprite(s:Sprite) {
        //update velocity due to gravity
        let oldVel = s.getVelocity();
        let newPos = s.getPosition().copy();

        if (s instanceof Gate) {
            if (!(s as Gate).isPlaced()) {
                oldVel.y=oldVel.y+GRAVITY*deltaTime;
                s.setVelocity(oldVel.x,oldVel.y);
            }
        }
        else if (!s.isFlying()) { 
            oldVel.y=oldVel.y+GRAVITY*deltaTime;
            s.setVelocity(oldVel.x,oldVel.y);
        }
        

        //update the x part of position first
        newPos.x = newPos.x + oldVel.x*deltaTime;
        //see if there was a collision with a tile at the new location
        let point = this.getTileCollision(s,newPos);
        if (point) {
            if (oldVel.x > 0) { //moving to the right
                newPos.x = this.tilesToPixels(point.x) - s.getImage().width;
            } else if (oldVel.x < 0) { //moving to the left
                newPos.x = this.tilesToPixels(point.x+1);
            }
            s.collideHorizontal();
        }
        s.setPosition(newPos.x,newPos.y);
        if (s instanceof Player) {
            this.checkPlayerCollision(s as Player, false);
        }
        
        /*
         * update the y position by using old velocity and delta time
         */
        let oldY = newPos.y;
        newPos.y = newPos.y + oldVel.y*deltaTime;
        /*
         * check for collision with a tile at the new location
         */
        point = this.getTileCollision(s,newPos);
        if (point) {
            if (oldVel.y > 0 ) {
                newPos.y = this.tilesToPixels(point.y) - (s.getImage().height);
            }
            else if (oldVel.y < 0) {
                newPos.y = this.tilesToPixels(point.y+1);
            }
            s.collideVertical();
        }
        s.setPosition(newPos.x,newPos.y);
        /*
         * if the object is a player, check for collision with objects and other sprites
         */
        if (s instanceof Player) {
            this.checkPlayerCollision(s as Player, oldY < newPos.y);
        } 


        else if ((s instanceof Station)) {
            let spriteCollided=this.getSpriteCollision(s);
                if ((spriteCollided instanceof Gate) && this.heldMedallion == null  && (s as Station).checkingIsInput && (s as Station).checkingIsOutput()) {
                    //Controling power on/off as <is there a gate in me>
                        if ((s as Station).getState() == StationState.OFF) {
                        const gatePos = spriteCollided.getPosition();
                        const gateImg = spriteCollided.getImage();
                        const stationPos = s.getPosition();
                        const stationImg = s.getImage();

                        const gateHalfWidth = gateImg.width / 2;
                        const gateHalfHeight =  gateImg.height / 2;

                        const stationCenterX = stationPos.x + stationImg.width / 2;
                        const stationCenterY = stationPos.y + stationImg.height / 2;

                        spriteCollided.setPosition((stationCenterX - gateHalfWidth), (stationCenterY - gateHalfHeight));
                        (spriteCollided as Gate).stopMoving();
                        spriteCollided.setVelocity(0,0);
                        
                        (s as Station).changeState(StationState.ON);
                        }

                    //Controlling output as <what gate is in me>
                       if ((spriteCollided as Gate).getState() == GateState.AND) {
                        (s as Station).changeCenter(CenterState.AND);
                       }
                       else if ((spriteCollided as Gate).getState() == GateState.OR) {
                        (s as Station).changeCenter(CenterState.OR);
                       }
                       else if ((spriteCollided as Gate).getState() == GateState.NOT) {
                        (s as Station).changeCenter(CenterState.NOT);
                       }
                       
                }
                else if (spriteCollided instanceof Circuit && this.heldMedallion == null) {
                    if((s as Station).checkingIsOutput && (spriteCollided as Circuit).getState() == CircuitState.START) {
                        if ((s as Station).getState() == StationState.OFF) {
                        const gatePos = spriteCollided.getPosition();
                        const gateImg = spriteCollided.getImage();
                        const stationPos = s.getPosition();
                        const stationImg = s.getImage();

                        const gateHalfWidth = gateImg.width / 2;
                        const gateHalfHeight =  gateImg.height / 2;

                        const stationCenterX = stationPos.x + stationImg.width / 2;
                        const stationCenterY = stationPos.y + stationImg.height / 2;

                        spriteCollided.setPosition((stationCenterX - gateHalfWidth), (stationCenterY - gateHalfHeight));
                        (spriteCollided as Circuit).stopMoving();
                        spriteCollided.setVelocity(0,0);
                        
                        (s as Station).changeState(StationState.ON);
                        }
                    }
                    else if ((s as Station).checkingIsInput && (spriteCollided as Circuit).getState() == CircuitState.END) {
                        if ((s as Station).getState() == StationState.OFF) {
                        const gatePos = spriteCollided.getPosition();
                        const gateImg = spriteCollided.getImage();
                        const stationPos = s.getPosition();
                        const stationImg = s.getImage();

                        const gateHalfWidth = gateImg.width / 2;
                        const gateHalfHeight =  gateImg.height / 2;

                        const stationCenterX = stationPos.x + stationImg.width / 2;
                        const stationCenterY = stationPos.y + stationImg.height / 2;

                        spriteCollided.setPosition((stationCenterX - gateHalfWidth), (stationCenterY - gateHalfHeight));
                        (spriteCollided as Circuit).stopMoving();
                        spriteCollided.setVelocity(0,0);
                        
                        (s as Station).changeState(StationState.ON);
                        }
                    }
                    
                }
                else {
                    (s as Station).changeState(StationState.OFF);
                    (s as Station).changeCenter(CenterState.EMPTY);
                } 
            }
        /*
         * if the object is not a player, check for collision with other sprites
         * if they collide, bounce off of eachother and change directions
         */
        else {
            
            let spriteCollided=this.getSpriteCollision(s);
            if (spriteCollided && !(spriteCollided instanceof Projectile)) {
                let oldVel=s.getVelocity();
                s.setVelocity(oldVel.x*-1, - oldVel.y);
                
            }
        }
    }
    
    /*
     * This method runs while the game is running, it updates the whole game as it is going on. 
     */
    update() {
        if (this.player.getState() == CreatureState.DEAD) {
            this.initialize(); //start the level over
            return;
        }
        
        //UPDATE THE DORE
        
        this.updateSprite(this.player);
        this.player.update(deltaTime); 

        this.sprites.forEach((sprite,index,obj) => {
            if (sprite instanceof Creature ) {
                if (sprite.getState() == CreatureState.DEAD) {
                    obj.splice(index,1);
                }
                else {
                    this.updateSprite(sprite);
                    sprite.update(deltaTime);

                    sprite.effectMap(this);
                
                } 
            }
            else if (sprite instanceof Station && (sprite as Station).checkingIsInput && !(sprite as Station).checkingIsOutput) {
            (sprite as Station).checkOutput();
            }
            else if (sprite instanceof Circuit) {
             (sprite as Circuit).checkPower();
             }
            else if (sprite instanceof PowerUp || sprite instanceof Station) {
                if (sprite instanceof Gate || sprite instanceof Station) {
                    this.updateSprite(sprite);
                }
                sprite.update(deltaTime);
            }
        });
        
        const hDown = keyIsDown(72); // H key

        // Press H once to pick up nearby medallion
        if (hDown && !this.hWasDown && this.heldMedallion === null) {
            const nearby = this.getNearbyMedallion(120);

             if (nearby) {
             this.heldMedallion = nearby;
             this.robot_pickup.play();
             if (this.heldMedallion instanceof Gate) {
             (this.heldMedallion as Gate).startMoving();
             }
         }
        }

        // Press H again to drop it
        else if (hDown && !this.hWasDown && this.heldMedallion !== null) {
            const playerPos = this.player.getPosition();

            if (this.player.currAnimName.toUpperCase().includes("LEFT")) {
                this.heldMedallion.setPosition( //PUT DOWN LEFT
                playerPos.x - 40,
                playerPos.y + 56);
                this.robot_putdown.play();
            this.heldMedallion = null;
            }
            else {
                this.heldMedallion.setPosition( //PUT DOWN RIGHT
                playerPos.x + 120,
                playerPos.y + 56);
                this.robot_putdown.play();
            this.heldMedallion = null;
            }
            
    }

        // If holding a medallion, move it with the player
        if (this.heldMedallion !== null) {
        const playerPos = this.player.getPosition();

        this.heldMedallion.setPosition( //HOLDING
            playerPos.x + 35,
            playerPos.y - 64);
}
        // Remember whether H was pressed last frame
        this.hWasDown = hDown;

}

    /*Per-Pixel Collision Detection
     * Got code from https://openprocessing.org/sketch/149174/ which implements this
     * in Processing (An older precurser to p5.js)
     * I've modified it to work with p5.js and TypeScript
     * this method gets the position of the sprite and calls upon the image collision
     */
    pp_collision(a:Sprite, b:Sprite):boolean {
        /*
         * these parameters get the image of the sprite, they get the position of the sprite
         * they set the position of the sprite
         * then calls upon the image collision method to check for collisions
         */
        let imgA = a.getImage();
        let aPos = a.getPosition();
        let aix = aPos.x;
        let aiy = aPos.y;
        let imgB = b.getImage();
        let bPos = b.getPosition();
        let bix = bPos.x;
        let biy = bPos.y;

        return this.pp_image_collision(imgA,aix,aiy,imgB,bix,biy);
    }

    /*
     * this method deals with the exact pixels that collide with each other in the images
     */
    pp_image_collision(imgA:p5.Image, aix:number, aiy:number, imgB:p5.Image, bix:number, biy:number) {
        let topA   = aiy;
        let botA   = aiy + imgA.height;
        let leftA  = aix;
        let rightA = aix + imgA.width;
        let topB   = biy;
        let botB   = biy + imgB.height;
        let leftB  = bix;
        let rightB = bix + imgB.width;
        if (botA <= topB  || botB <= topA || rightA <= leftB || rightB <= leftA)
            return false;

        let leftO = (leftA < leftB) ? leftB : leftA;
        let rightO = (rightA > rightB) ? rightB : rightA;
        let botO = (botA > botB) ? botB : botA;
        let topO = (topA < topB) ? topB : topA;

        let APx = leftO-leftA;   
        let APy = topO-topA;
        let ASx = rightO-leftA;  
        let ASy = botO-topA-1;
        let BPx = leftO-leftB;   
        let BPy = topO-topB;

        let widthO = rightO - leftO;
        let foundCollision = false;

        imgA.loadPixels();
        imgB.loadPixels();

        let surfaceWidthA = imgA.width;
        let surfaceWidthB = imgB.width;

        let pixelAtransparent = true;
        let pixelBtransparent = true;

        let pA = (APy * surfaceWidthA) + APx;
        let pB = (BPy * surfaceWidthB) + BPx;

        let ax = APx; 
        let ay = APy;
        let bx = BPx; 
        let by = BPy;

        for (ay = APy; ay < ASy; ay++) {
            bx = BPx;
            for (ax = APx; ax < ASx; ax++) {       
                let pixelAtransparent = imgA.pixels[pA*4] < this.ALPHALEVEL;
                let pixelBtransparent = imgB.pixels[pB*4] < this.ALPHALEVEL;
                if (!pixelAtransparent && !pixelBtransparent) {
                    foundCollision = true;
                    break;
                }
                pA ++;
                pB ++;
                bx++;
            }
            if (foundCollision) break;
            
            pA = pA + surfaceWidthA - widthO;
            pB = pB + surfaceWidthB - widthO;
            by++;
        }
        
        return foundCollision;
    }


}