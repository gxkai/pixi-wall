import * as PIXI from 'pixi.js';
import {EventEmitter, MEDALS} from './constants';
import getHowlSound from './utils/getHowlerSound';
class Statistics extends PIXI.utils.EventEmitter{
    private panel = new PIXI.Sprite(PIXI.Texture.from('gameOver.png'));
    private medal: PIXI.Sprite = new PIXI.Sprite()
    private scoreText: PIXI.Text = new PIXI.Text('', new PIXI.TextStyle({
    	fontSize: 10,
    	fontWeight: 'normal'
    }))
	private bestScoreText: PIXI.Text = new PIXI.Text(localStorage.getItem('bestScore') || '0', new PIXI.TextStyle({
		fontSize: 10,
		fontWeight: 'normal'
	}))
    private _score = 0
	private pointSound = getHowlSound('sfx_point.wav', )
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
		this.bestScoreText.position.x = 90;
		this.bestScoreText.position.y = 35;
    	this.panel.addChild(this.bestScoreText);
    	this.update();
	}
    public update = ()=> {
    	let sourceName = '';
    	if (this._score >= 70) {
    		sourceName =  MEDALS[2];
    	}
    	if (this._score >= 20 && this._score < 70) {
    	    sourceName =  MEDALS[1];
    	}
    	if (this._score >= 0 && this._score < 20) {
    	    sourceName = MEDALS[0];
    	}

    	this.medal.texture = PIXI.Texture.from(`${sourceName}.png`);
    	this.scoreText.text = this._score.toString(10);
    	this.bestScoreText.text = localStorage.getItem('bestScore') || '0';
    }
    public plus = (score = 1): void=> {
    	this._score += score;
    	this.emit(EventEmitter.PASS_SPEED);
    	this.pointSound.play();
    }

    public minus = (): void=> {
    	this._score --;
    }
    public clear = (): void=> {
    	const p = localStorage.getItem('bestScore')?  Number(localStorage.getItem('bestScore')): 0;
    	const c = this._score;
    	localStorage.setItem('bestScore', p > c ? p.toString(10): c.toString(10));
    	this._score = 0;
    }
    get score() {
    	return this._score;
    }
}
export default Statistics;
