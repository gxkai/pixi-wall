import * as PIXI from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, EventEmitter } from './constants';
import Coin from './coin';
import {Howl} from 'howler';
import getHowlSound from './utils/getHowlerSound';
function checkCollision(object1, object2) {
	const bounds1 = object1.getBounds();
	const bounds2 = object2.getBounds();

	return bounds1.x < bounds2.x + bounds2.width
		&& bounds1.x + bounds1.width > bounds2.x
		&& bounds1.y < bounds2.y + bounds2.height
		&& bounds1.y + bounds1.height > bounds2.y;
}
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
private dieSound: Howl = getHowlSound('sfx_die.wav', );
private hitSound: Howl = getHowlSound('sfx_hit.wav', );
public constructor(stage: PIXI.Container) {
	super();
	stage.addChild(this.container);
	this.reset();
}

public update(): void {
	this.x -= this.speedX;
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
	console.log(this.container.width);
	if (this.x < -this.container.width) this.reset();
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
	for (let i=0; i< 20; i++) {
		const s = new Coin((i+ 1) * 80);
		this.coins.push(s);
	}
}
public checkCoinCollision(
	player: PIXI.Sprite
): void {
	for (const [i, v] of this.coins.entries()) {
		if (checkCollision(player, v)) {
			this.coins.splice(i, 1);
			v.destroy();
			this.emit(EventEmitter.COIN_COLLISION, v.score);
			break;
		}
	}
}

public checkPipeCollision(
	player: PIXI.Sprite
): void {
	let flag = false;
	const {x, y, width, height} = player;
	if (checkCollision(player, this.pipeUp) || checkCollision(player, this.pipeDown)) {
		flag = true;
	}
	if (y < -height / 2 || y > CANVAS_HEIGHT + height / 2) {
		this.dieSound.play();
		this.emit(EventEmitter.OUT_SCREEN);
		return;
	}
	if (flag) {
		if (this.collisionCount === 0) {
			this.hitSound.play();
			this.emit(EventEmitter.PASS_COLLISION);
		}
		this.collisionCount ++;
	}
}
public checkPipePassed(
	player: PIXI.Sprite
): void {
	const {x, y, width, height} = player;
	if (this.collisionCount > 0) {
		return;
	}
	if (this.x + this.wallWidth < x - width/2 && !this.passed) {
		this.collisionCount = 0;
		this.passed = true;
		this.emit(EventEmitter.PASS_THROUGH);
	}
}
public changeSpeed(val: number) {
	if (val< 8) {
		this.speedX = 2 * 1.5 ** val;
	}
}
}

export default Wall;
