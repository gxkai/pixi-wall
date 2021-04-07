import * as PIXI from 'pixi.js';
import {CANVAS_HEIGHT, CANVAS_WIDTH} from './constants';

class Background {
	public constructor(stage: PIXI.Container) {
    	const bg = new PIXI.TilingSprite(PIXI.Texture.from('background.png'));
    	bg.height = CANVAS_HEIGHT;
    	bg.width = CANVAS_WIDTH;
    	stage.addChild(bg);
	}
}
export default Background;
