import * as PIXI from 'pixi.js';
import {EventEmitter} from './constants';
class Statistics extends PIXI.utils.EventEmitter{
    private panel = new PIXI.Sprite(PIXI.Texture.from('gameOver.png'));
    private medal: PIXI.Sprite = new PIXI.Sprite()
    private scoreText: PIXI.Text = new PIXI.Text('', new PIXI.TextStyle({
    	fontSize: 10,
    	fontWeight: 'normal'
    }))
    private _score = 0
    constructor(stage: PIXI.Container) {
    	super();
    	stage.addChild(
    		this.panel
    	);
    	this.medal.position.x = 15;
    	this.medal.position.y = 20;
    	this.panel.addChild(this.medal);
    	this.scoreText.position.x = 90;
    	this.scoreText.position.y = 15;
    	this.panel.addChild(this.scoreText);
    	this.update();
    }
    public update = ()=> {
    	let sourceName = '';
    	if (this._score > 0) {
    	    sourceName = 'goldMedal';
    	}
    	if (this._score > 10) {
    	    sourceName = 'bronzeMedal';
    	}
    	if (this._score <= 0) {
    	    sourceName = 'silverMedal';
    	}

    	this.medal.texture = PIXI.Texture.from(`${sourceName}.png`);
    	this.scoreText.text = this._score.toString(10);
    }
    public plus = (): void=> {
    	this._score ++;
    	this.emit(EventEmitter.PASS_SPEED);
    }

    public minus = (): void=> {
    	this._score --;
    }
    public clear = (): void=> {
    	this._score = 0;
    }
    get score() {
    	return this._score;
    }
}
export default Statistics;
