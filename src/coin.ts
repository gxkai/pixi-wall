import * as PIXI from 'pixi.js';
import {CANVAS_HEIGHT, MEDALS} from './constants';
class Coin extends PIXI.Sprite{
    public offsetX: number;
    public score: number;
    constructor(offsetX: number) {
    	super();
    	const i = Math.floor(Math.random() * 3);
    	this.texture = PIXI.Texture.from(`${MEDALS[i]}.png`);
    	this.score = i + 1;
    	this.offsetX = offsetX;
    	this.position.y = Math.random() * CANVAS_HEIGHT;
    }
}
export default Coin;
