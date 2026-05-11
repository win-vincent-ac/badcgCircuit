import { SoundFile } from "p5";
import { Player } from "./sprites/Player.js";
import { Fly, Grub, Creature } from "./sprites/Creature.js";
import { Heart, Music, PowerUp, Star } from "./sprites/PowerUp.js";
import { Sprite } from "./sprites/Sprite.js";
import { Bullet } from "./sprites/Bullet.js";
import {MyFly} from "./sprites/MyFly.js";
import { Power } from "./sprites/PowerUp.js";
import { FinalBoss } from "./sprites/FinalBoss.js";
import {Lava} from "./sprites/Lava.js";
import { Fireball } from "./sprites/Fireball.js";
import { Projectile, EnemyProjectile} from "./sprites/Projectile.js";
import {Door} from "./sprites/Door.js";

export class ResourceManager {

    assets: Object;
    loads: {[key: string]: any};
    resources: {[key: string]: any};
    everythingLoaded: boolean;
    /**
     * this initializes different aspects in the game
     * @param f 
     */
    constructor(f:string) {
        this.everythingLoaded=false;
        this.loads={};
        this.resources={};
        this.init(f);
    }

    /**
     * Initializes all the fields by loading the asset file from the given parameter,
     * Then loading all of the assets and storing them in loads
     * and then building resources from those loads.  This function await's for all
     * assets to be loaded and resources built.
     */
    async init(f:string) {
        let promise=this.loadResource(f,"json");
        await promise.then(value =>{

            /**
             * loads up all the assets
             */
            this.assets=value;
            
        }).catch(value => {
            throw new Error("Unable To Load Asset File: "+f);
        });
        /**
         * loads all the assets at the same time 
         */
        let loadPromises=[];
        let loadNames=[];
        for (const loadType in this.assets) {
            if (Object.prototype.hasOwnProperty.call(this.assets, loadType)) {
                const loadsForType = this.assets[loadType];
                for (const loadName in loadsForType) {
                    if (Object.prototype.hasOwnProperty.call(loadsForType, loadName)) {
                        const element = loadsForType[loadName];
                        loadPromises.push(this.loadResource(element,loadType));
                        loadNames.push(loadName);
                    }
                }
            }
        }
        /**
         * once all the assests are loaded, we store them in the loads object
         */
        await Promise.all(loadPromises).then( values => {
            for (let index = 0; index < values.length; index++) {
                this.loads[loadNames[index]]=values[index];
                
            }
        }).catch( value => {
            throw new Error("Failed in loading assets "+value);
        });
        /**
         * this if loop processes all the resources
         */
        if (this.loads.hasOwnProperty("resources")) {
            for (const resourceType in this.loads["resources"]) {
                if (Object.prototype.hasOwnProperty.call(this.loads["resources"], resourceType)) {
                    const resources = this.loads["resources"][resourceType];
                    switch (resourceType) {
                        case "images": {
                            /**
                             *  copy them over to the resources with the given name
                             */
                            for (const resourceName in resources) {
                                if (Object.prototype.hasOwnProperty.call(resources, resourceName)) {
                                    const loadName = resources[resourceName];
                                    this.resources[resourceName]=this.loads[loadName];
                                }
                            }
                            break;
                        }
                        case "maps": {
                            /**
                             * Store local maps and levels as resources
                             */
                            for (const key in resources) {
                                if (Object.prototype.hasOwnProperty.call(resources, key)) {
                                    this.resources[key]=resources[key];
                                }
                            }
                            break;
                        }
                        case "sounds": {
                            /**
                             * ignore sounds for now
                             */
                            break;
                        }
                        case "sprites": {
                            /**
                             * creates sprites using the buildSprite function
                             */
                            for (const spriteName in resources) {
                                if (Object.prototype.hasOwnProperty.call(resources, spriteName)) {
                                    const buildProcess = resources[spriteName];
                                    let spriteType=buildProcess['type'];
                                    delete buildProcess['type'];
                                    this.resources[spriteName]=this.buildSprite(spriteName,buildProcess,spriteType);
                                }
                            }
                            break;
                        }
                        default: {
                        }
                    }
                }
            }
        } else {
        }
        /**
         * tells us if everything has been loaded
         */
        this.everythingLoaded=true;
    }
    /**
     * This method initializes 's' as a sprite and it calls upon different sprite classes 
     * to create different enemies or powerups in our game
     * @param spriteName 
     * @param anims 
     * @param spriteType 
     * @returns 
     */
    /**
     * this method builds all of the sprites that are in our game
     */
    buildSprite(spriteName:string, anims: any, spriteType:string): Sprite {
        let first=true;
        let s;
        /**
         * builds our sprites and names them
         */
        switch (spriteType) {
            case 'Player': {
                s = new Player();
                break;
            }
            case 'Creature': {
                s = new Creature();
                break;
            }
            case 'Sprite': {
                s = new Sprite();
                break;
            }
            case 'FinalBoss': {
                s = new FinalBoss();
                break;
            }
            case 'Fly': {
                s = new Fly();
                break;
            }
            case 'EndPortal': {
                s = new Door();
                break;
            }
            case 'PowerUp': {
                s = new PowerUp();
                break;
            }
            case 'Star': {
                s = new Star();
                break;
            }
            case 'Music': {
                s = new Music();
                break; 
            }
            case 'MyFly': {
                s = new MyFly();
                break;
            }
            case 'Power': {
                s = new Power();
                break;
            }
            case 'Lava':{
                s = new Lava();
                break;
            }
            default: {
                throw new Error();
            }
        }
        /**
         * this for loop is a loop through each animation
         */
        for (const animName in anims) {
            if (Object.prototype.hasOwnProperty.call(anims, animName)) {
                const frames = anims[animName];
                /**
                 * this adds animation to the sprites
                 */
                s.addAnimation(animName);
                if (first) {
                /**
                 * sets the first animation to be played
                 */
                    s.setAnimation(animName);
                    first=false;
                }
                /**
                 * another loop for each animation
                 */
                frames.forEach(frame => {
                    let images;
                    if (frame.hasOwnProperty("sheet")) {
                        /**
                         * below states that if a sprite is part of a sprite sheet
                         * it should divide the sheet into separate images
                         */
                        let startImg=this.loads[frame.sheet];
                        images=this.divideUpImage(startImg,frame.rows,frame.cols);
                    } else {
                        /**
                         * it's a single image, but it keeps it as a list
                         */
                        images=[this.loads[frame.img]];
                    }
                    /**
                     * this is a loop for each image in the frame
                     */
                    images.forEach(img => {
                        if (frame.hasOwnProperty("operators")) {
                            /**
                             * this applies any image operators before the animation
                             */
                            frame['operators'].forEach(operator => {
                                switch(operator) {
                                    case "mirror": {
                                        img=this.mirror(img);
                                        break;
                                    }
                                    case "flip": {
                                        img=this.flip(img);
                                        break;
                                    }
                                    default: {
                                        break;
                                    }
                                }
                            });
                        } 
                        /*
                         * adds the frame to the animation
                         */
                        s.addFrame(animName,img,frame.duration);
                    })
                });
            }
        }
        return s;
    }
    /*
     * this method divdes images into a grid, based on how big they want the grid
     * rows by columns
     */
    divideUpImage(img:p5.Image,rows:number,cols:number):p5.Image[] {
        let images:p5.Image[]=[];
        let canvas=createGraphics(img.width/cols,img.height/rows);
        for(let rowIndex=0;rowIndex<img.height;rowIndex+=img.height/rows) {
            for(let colIndex=0;colIndex<img.width;colIndex+=img.width/cols) {

                canvas.image(img, 0,0, img.width/cols, img.height/rows, colIndex, rowIndex, img.width/cols, img.height/rows);
                images.push(canvas.get());
                canvas.clear();
            }
        }
        return images;
    }

    /**
     * Returns true when all resources requested have been loaded and built.
     */
    isLoaded():boolean {
        return this.everythingLoaded;
    }


    /**
     * Loads the resource from the provided location (file or URL).  Returns a Promise.
     * @param rsc -- The file or URL to be loaded
     * @param t -- The type of the resource.  Valid types: image, text, json, get(performs HTTP get request)
     */
    loadResource(rsc:string,t:string):Promise<unknown> {
        return new Promise((resolve,reject) => {
            switch(t) {
                /**
                 * load an image as a spritesheet
                 */
                case "spritesheet": {
                    loadImage(rsc,img => {
                        resolve(img);
                    }, () => {
                        reject("failed to load "+rsc);
                    });
                    break;
                }
                /**
                 * load an image
                 */
                case "image": {
                    loadImage(rsc,img => {
                        resolve(img);
                    }, () => {
                        reject("failed to load "+rsc);
                    });
                    break;
                }
                /**
                 * load an text
                 */
                case "text": {
                    loadStrings(rsc,txt => {
                        resolve(txt);
                    }, () => {
                        reject("failed to load "+rsc);
                    });
                    break;
                }
                /**
                 * load an json file
                 */
                case "json": {
                    loadJSON(rsc, j => {
                        resolve(j);
                    }, () => {
                        reject("failed to load "+rsc);
                    });
                    break;
                }
                /**
                 * load an sound file
                 */
                case "sound": {
                    loadSound(rsc, j => {
                        resolve(j);
                    }, () => {
                        reject("failed to load "+rsc);
                    });
                    break;
                }
                /**
                 * send an get request and load the response
                 */
                case "get": {
                    httpGet(rsc, j => {
                        resolve(j);
                    }, () => {
                        reject("failed to load "+rsc);
                    });
                    break;
                }
                /**
                 * this states that if an invalid type is specified, 
                 * reject it with an error message
                 */
                default: {
                    reject("invalid type of resource: "+t);
                    break;
                }
            }
            });
    }
    /**
     * return an array of resource names stored in ResourceManager
     * @returns
     */
    listResources():string[] {
        /**
         * use object.keys to obtain an array of the names in this.resources
         */
        return Object.keys(this.resources);
    }
    /**
     * return the specified resource with its name
     * @param name 
     * @returns 
     */
    get(name:string):any {
        return this.resources[name];
    }
    /**
     * return the loaded resource with its name
     * @param name 
     * @returns 
     */
    getLoad(name:string):any {
        return this.loads[name];
    }

    /**
     * this method creates an upside down image
     * @param img 
     * @returns 
     */
    flip(img:p5.Image):p5.Image {
        /**
         * Load the pixels of the original image
         */
        img.loadPixels();
        /**
         *  Create a new image with the same dimensions as the original
         */ 
        let img2=createImage(img.width,img.height);
        img2.loadPixels();
        let newRow=img2.height;
      /**
       * this for loop looks over each pixel in the image
       */
        for(let row=0;row<img.height;row++) {
            for(let col=0;col<img.width;col++) {
                /**
                 * it calculates the starting index of the pixels in the original image
                 */
                let startIndex=(row*img.width+col)*4;
                /**
                 * it calculates the starting index of the pixels in the flipped image
                 */
                let newStartIndex=(newRow*img2.width+col)*4;
                /**
                 * it copies the pixel values from the original to the flipped image
                 */
                img2.pixels[newStartIndex]=img.pixels[startIndex];
                img2.pixels[newStartIndex+1]=img.pixels[startIndex+1];
                img2.pixels[newStartIndex+2]=img.pixels[startIndex+2];
                img2.pixels[newStartIndex+3]=img.pixels[startIndex+3];
            }
            /**
             * its subtracting one from the new row
             */
            newRow--;
        }
        /**
         * updates the pixels of the flipped image and returns it
         */
        img2.updatePixels();
        return img2;
    }
  
    /**
     * creates an mirrored image of the original photo
     * @param img 
     * @returns 
     */
    mirror(img:p5.Image):p5.Image {
        /**
         * loads the pixels of the original image
         */
        img.loadPixels();
        /**
         * creates a new image based off of the original image
         */
        let img2 = createImage(img.width,img.height);
        img2.loadPixels();
        /**
         * this loop looks over each pixel in the image
         */
        for(let row=0;row<img.height;row++) {
            let newCol=img.width-1;
            for(let col=0;col<img.width;col++) {
                /**
                 * it calculates the starting index of the pixels in the original image
                 */
                let startIndex=(row*img.width+col)*4;
                /**
                 * it calculates the ending index of the pixels in the original image
                 */
                let endIndex=(row*img.width+newCol)*4; 
                /**
                 * it copies the pixel values from the original to the flipped image
                 */
                img2.pixels[endIndex]=img.pixels[startIndex];
                img2.pixels[endIndex+1]=img.pixels[startIndex+1];
                img2.pixels[endIndex+2]=img.pixels[startIndex+2];
                img2.pixels[endIndex+3]=img.pixels[startIndex+3];
                /**
                 * subtracts one from the column
                 */
                newCol--;
            }
        } 
        /**
         * updates the pixels of the mirrored image and returns it
         */
        img2.updatePixels();
        return img2;
    }

}
/**
 * This is an interface for a key-value pair where the keys are strings
 * and the values can be any type
 */
interface KeyValuePair {
    [name:string]: any;
}