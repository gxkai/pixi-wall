import * as PIXI from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

class Wall {
  private sprite = new PIXI.Graphics();
  private pipeUp = new PIXI.Sprite(PIXI.Texture.from('pipeUp.png'));
  private pipeDown = new PIXI.Sprite(PIXI.Texture.from('pipeDown.png'));
  private x = 0;
  private y = 0;
  private speedX = 2;
  private wallWidth = 20;
  private innerDistance = 65;

  public constructor(stage: PIXI.Container) {
  	stage.addChild(this.sprite);
  	this.reset();
  }

  public update(): void {
  	this.x -= this.speedX;
  	if (this.x < -this.wallWidth) this.reset();

  	this.sprite.clear();
  	this.sprite.beginFill(0xffffff, 1);
  	const { x, y, wallWidth,innerDistance } = this;
  	this.pipeUp.position.x = x;
  	this.pipeUp.position.y = 0;
  	this.pipeUp.height = y;
  	this.pipeUp.width = wallWidth;
  	this.sprite.addChild(this.pipeUp);
  	this.pipeDown.position.x = x;
  	this.pipeDown.position.y = y + innerDistance;
  	this.pipeDown.height = CANVAS_HEIGHT - y - innerDistance;
	  this.pipeDown.width = wallWidth;
	  this.sprite.addChild(this.pipeDown);
  	this.sprite.endFill();
  }

  public reset(): void {
  	this.sprite.clear();
  	this.x = CANVAS_WIDTH + 20;

  	const wallMinHeight = 20;
  	const randomNum =
      Math.random() * (CANVAS_HEIGHT - 2 * wallMinHeight - this.innerDistance);
  	this.y = wallMinHeight + randomNum;
  }

  public checkCollision(
  	x: number,
  	y: number,
  	width: number,
  	height: number
  ): boolean {
  	if (!(x + width < this.x || this.x + this.wallWidth < x || this.y < y)) {
  		return true;
  	}
  	return !(
  		x + width < this.x ||
		this.x + this.wallWidth < x ||
		y + height < this.y + this.innerDistance
  	);

  }
}

export default Wall;
