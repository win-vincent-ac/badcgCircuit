/**
 * A Sprite is a character in a game.  It can have mulitple animations and each animation
 * can have multiple images displayed for a varying amount of time.  In addition, a Sprite can have different
 * state properties which can be set/changed/deleted.  These state properties can be used to change the Sprites
 * behavior and abilities.
 */

export class Sprite {
    /**
     * declares the properties of a sprite
     */
    protected position : p5.Vector;
    protected velocity : p5.Vector;
    protected animations : AnimPair;
    protected currAnimName: string;
    protected currAnimation: Animation;
    /**
     * the constructor initializes different properties of the sprite
     */
    constructor() {
        this.animations={};
        this.addAnimation("default");
        this.position=createVector(0,0);
        this.velocity=createVector(0,0);
        this.currAnimName="default";
        this.currAnimation=this.animations["default"];
    }
    /**
     * this method stops the sprite from moving vertically
     */
    collideVertical() {
        this.velocity.y=0;
    }
    /**
     * this method stops the sprite from moving horizontal 
     * it also makes it reverse its direction
     */
    collideHorizontal() {
        this.velocity.x=-this.velocity.x;
    }
    /**
     * determines if the sprite is flying
     * @returns 
     */
    isFlying() {
        return false;
    }
    /**
     * clones a sprite
     * @returns 
     */ 
    clone() {
        let s = new (this.constructor as any)();
        s.position = this.position.copy();
        s.velocity = this.velocity.copy();
        s.animations={}; 
        /**
         * throw away the animations from the new constructor call
         * and copy over the animations from this
         */
        for (const key in this.animations) {
            if (Object.prototype.hasOwnProperty.call(this.animations, key)) {
                const element = this.animations[key];
                s.animations[key]=element.clone();
            }
        }
        s.currAnimName = this.currAnimName;
        s.currAnimation = s.animations[s.currAnimName];
        return s;
    }
    /**
     * This gets the current animation name and returns it
     * @returns 
     */
    getCurrAnimName():string {
        return this.currAnimName;
    }
    /**
     * this gets the current animation and returns it
     * @returns 
     */
    getCurrAnimation():Animation {
        return this.currAnimation;
    }
    /**
     * this gets the position of the sprite and returns it
     * @returns 
     */
    getPosition() {
        return this.position;
    }
    /**
     * this gets the velocity of the sprite and returns it
     * @returns 
     */
    getVelocity() {
        return this.velocity;
    }
    /**
     * this adds a certain x and  y value to the x and y velocity
     * @param x 
     * @param y 
     */
    addVelocity(x:number,y:number) {
        this.velocity.add(x,y);
    }
    /**
     * this sets the x and y velocity to a certain number
     * @param x 
     * @param y 
     */
    setVelocity(x:number, y:number) {
        this.velocity.set(x,y);
    }
    /**
     * this sets the position of the sprites
     * @param x 
     * @param y 
     */
    setPosition(x:number, y:number) {
        this.position.set(x,y);
    }
    /**
     * adds animations from images
     * @param anims 
     * @param width 
     * @param duration 
     * @param reverse 
     */
    addAnimations(anims:{string:p5.Image}, width:number, duration:number, reverse=false) {
        /**
         * loop through the names of images
         */
        for (const name in anims) {
            if (Object.prototype.hasOwnProperty.call(anims, name)) {
                /**
                 * gets the image for this animation
                 */
                const img = anims[name];
                /**
                 * creates a new animation
                 */
                this.animations[name]=new Animation();
                /**
                 * loops through image frames and adds them to the animation
                 */
                for(let i=(reverse?img.width-width:0);(reverse?i>=0:i<img.width);(reverse?i-=width:i+=width)) {
                    let frame = img.get(i,0,width,img.height);
                    this.addFrame(name,frame,duration);
                }
            }
        }
    }
    /**
     * adds a new animation 
     * @param name 
     */
    addAnimation(name:string) {
        this.animations[name]=new Animation();
    }
    /**
     * sets the current animation
     * @param name 
     */
    setAnimation(name:string) {
        this.currAnimName=name;
        this.currAnimation=this.animations[name];
    }
    /**
     * adds the frame to the animation
     * @param name 
     * @param img 
     * @param duration 
     */
    addFrame(name:string, img:p5.Image, duration:number) {
        this.animations[name].totalDuration += duration;
        this.animations[name].frames.push(new AnimFrame(img,this.animations[name].totalDuration));
    }
    /**
     * starts the current animation
     */
    start() {
        this.currAnimation.animTime=0;
        this.currAnimation.currFrameIndex=0;
    }
    /**
     * updates the sprite
     * @param elapsedTime 
     */
    update(elapsedTime:number) {
        this.updateAnimation(elapsedTime);
    }
    /**
     * updates the current animation
     * @param elapsedTime 
     */
    updateAnimation(elapsedTime:number) {
        if (this.currAnimation.frames.length > 1) {
            this.currAnimation.animTime += elapsedTime;
            if (this.currAnimation.animTime >= this.currAnimation.totalDuration) {
                this.currAnimation.animTime %= this.currAnimation.totalDuration;
                this.currAnimation.currFrameIndex = 0;
            }
            while (this.currAnimation.animTime > this.currAnimation.frames[this.currAnimation.currFrameIndex].endTime) {
                this.currAnimation.currFrameIndex++;
            }
        }
    }
    /**
     * gets the current image of the sprite 
     * @returns 
     */
    getImage():p5.Image {
        if (this.currAnimation.frames.length > 0) {
            return this.currAnimation.frames[this.currAnimation.currFrameIndex].image;
        }
        return null;
    }

}
/**
 * interface of names and animations
 */
interface AnimPair {
    [name:string]: Animation;
}
/**
 * class for animations
 */
class Animation {
    /**
     * array of frames for the animations
     */
    frames : AnimFrame[];
    /**
     * index of the current frame for the animation
     */
    currFrameIndex: number;
    /**
     * the current time of the animation
     */
    animTime : number;
    /**
     * the duration of the animation
     */
    totalDuration : number;
/**
 * this constructor initializes the animation
 */
    constructor() {
        this.frames=[];
        this.currFrameIndex=0;
        this.animTime=0;
        this.totalDuration=0;
    }

    clone(): Animation {
        /**
         * The cloned Animation is a pointer to this Animation, except 
         * currFrameIndex and animTime so the cloned Animation can be at
         *  a different point in the animation cycle.
         */
        let a = new Animation();
        a.frames = this.frames;
        a.totalDuration = this.totalDuration;
        return a;
    }
}

class AnimFrame {
    /**
     * the image of the frame
     */
    image:p5.Image;
    /**
     * the end time of the frame
     */
    endTime:number;
    /**
     * this initializes the image and the end time
     * @param img 
     * @param endTime 
     */
    constructor(img:p5.Image, endTime:number) {
        this.image=img;
        this.endTime=endTime;
    }
}