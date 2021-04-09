import * as PIXI from 'pixi.js';
import {CANVAS_WIDTH, EventEmitter, TIME_COUNT} from './constants';
class Timing extends PIXI.utils.EventEmitter{
    private timeText :PIXI.Text = new PIXI.Text('', new PIXI.TextStyle({
    	fontFamily: 'Arial',
    	dropShadow: true,
    	dropShadowAlpha: 0.8,
    	dropShadowAngle: 2.1,
    	dropShadowBlur: 4,
    	dropShadowColor: '0x111111',
    	dropShadowDistance: 10,
    	fill: ['#ffffff'],
    	stroke: '#004620',
    	fontSize: 30,
    	fontWeight: 'lighter',
    	lineJoin: 'round',
    	strokeThickness: 12,
    }))
    private timeCount = TIME_COUNT;
    private timeControl!: any;
    constructor(stage: PIXI.Container) {
    	super();
    	this.update();
    	stage.addChild(this.timeText);
    }
    public update() {
    	this.timeText.text = this.timeCount.toString(10);
    	this.timeText.position.x = (CANVAS_WIDTH - this.timeText.width) / 2;
    }
    public start() {
    	this.timeControl = setTimeout(() => {
    		this.timeCount --;
    		if (this.timeCount > 0) {
    			this.start();
    		} else {
    			this.emit(EventEmitter.TIME_OUT);
    		}
    	}, 1000);
    }
    public reset() {
    	clearTimeout(this.timeControl);
    	this.timeCount = TIME_COUNT;
    }
}
export default Timing;
