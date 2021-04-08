import * as PIXI from 'pixi.js';
import {CANVAS_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT} from './constants';

class Background {
	public constructor(stage: PIXI.Container) {
    	const bg = new PIXI.TilingSprite(PIXI.Texture.from('background.png'));
    	bg.height = CANVAS_HEIGHT - GROUND_HEIGHT;
    	bg.width = CANVAS_WIDTH;
		stage.addChild(bg);
		const ground = new PIXI.TilingSprite(PIXI.Texture.from('ground.png'));
		ground.height = GROUND_HEIGHT;
		ground.width = CANVAS_WIDTH;
		ground.position.y = CANVAS_HEIGHT - GROUND_HEIGHT;
		stage.addChild(ground);
	}
}
export default Background;
