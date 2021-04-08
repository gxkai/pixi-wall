import * as PIXI from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, EventEmitter } from './constants';
import Coin from './coin';

class Wall extends PIXI.utils.EventEmitter{
  private container = new PIXI.Container();
  private pipeUp = new PIXI.Sprite(PIXI.Texture.from('pipeUp.png'));
  private pipeDown = new PIXI.Sprite(PIXI.Texture.from('pipeDown.png'));
  private coins: Coin[] = [];
  private x = 0;
  private y = 0;
  private speedX = 2;
  private wallWidth = 20;
  private innerDistance = 65;
  private passed = false;
  private collisionCount = 0;
  private _outScreen = false;
  public constructor(stage: PIXI.Container) {
  	super();
  	stage.addChild(this.container);
  	this.reset();
  }

  public update(): void {
  	this.x -= this.speedX;
  	if (this.x < -this.container.width) this.reset();
  	const { x, y, wallWidth,innerDistance } = this;
  	this.pipeUp.position.x = x;
  	this.pipeUp.position.y = 0;
  	this.pipeUp.height = y;
  	this.pipeUp.width = wallWidth;
  	this.container.addChild(this.pipeUp);
  	this.pipeDown.position.x = x;
  	this.pipeDown.position.y = y + innerDistance;
  	this.pipeDown.height = CANVAS_HEIGHT - y - innerDistance;
  	this.pipeDown.width = wallWidth;
  	this.container.addChild(this.pipeDown);

  	this.coins.forEach(_ => {
  		_.position.x = x + _.offsetX;
  		this.container.addChild(_);
  	});
  }

  public reset(): void {
  	this.passed = false;
  	this.collisionCount = 0;
  	this.container.removeChildren();
  	this.x = CANVAS_WIDTH + 20;

  	const wallMinHeight = 20;
  	const randomNum =
      Math.random() * (CANVAS_HEIGHT - 2 * wallMinHeight - this.innerDistance);
  	this.y = wallMinHeight + randomNum;

  	this.coins = [];
  	for (let i=0; i< 5; i++) {
  		const s = new Coin((i+ 1) * 80);
  		this.coins.push(s);
  	}
  }

  public checkCollision(
  	x: number,
  	y: number,
  	width: number,
  	height: number
  ): void {
  	const x1 = x - width / 2;
  	const y1 = y - height / 2;
  	let flag = false;
  	if (!(x1 + width < this.x || this.x + this.wallWidth < x1 || this.y < y1)) {
  		flag = true;
  	}
  	if (!(
  		x1 + width < this.x ||
		this.x + this.wallWidth < x1 ||
		y1 + height < this.y + this.innerDistance
  	)) {
  		flag = true;
  	}
  	if (y < -height / 2 || y > CANVAS_HEIGHT + height / 2) {
  		flag = true;
  		this._outScreen = true;
  	} else {
  		this._outScreen = false;
  	}
  	if (flag) {
  		if (this.collisionCount === 0) {
  			this.emit(EventEmitter.PASS_COLLISION);
  		}
  		this.collisionCount ++;
  	}
  }
  public checkPassed(
  	x: number,
  	y: number,
  	width: number,
  	height: number
  ): void {
  	if (this.collisionCount > 0) {
  		return;
  	}
  	if (this.x + this.wallWidth < x - width/2 && !this.passed) {
  		this.collisionCount = 0;
  		this.passed = true;
  		this.emit(EventEmitter.PASS_THROUGH);
  	}
  }
  public get outScreen() {
  	return this._outScreen;
  }
  public changeSpeed(val: number) {
  	this.speedX = 2 * 1.5 ** val;
  }
}

export default Wall;
