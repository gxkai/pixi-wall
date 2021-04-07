import * as PIXI from 'pixi.js';
import Wall from './wall';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY } from './constants';

class Player {
  private sprite = Player.bird;
  private speedY = 0;
  private wall: Wall;
  private readonly onCollide?: () => void;

  public constructor(
  	stage: PIXI.Container,
  	wall: Wall,
  	onCollide?: () => void
  ) {
  	this.reset();

  	this.wall = wall;
  	this.onCollide = onCollide;

  	this.sprite.pivot.set(this.sprite.width / 2, this.sprite.height / 2);

  	document.addEventListener('keydown', (event: KeyboardEvent): void => {
  		event.preventDefault();
  		if (event.key === ' ') {
  			this.addSpeed(-GRAVITY / 5);
  		}
  	});
  	document.addEventListener('mousedown', (event: MouseEvent): void => {
  		event.preventDefault();
  		this.addSpeed(-GRAVITY / 5);
  	});
  	stage.addChild(this.sprite);
  }

  public update = (): void => {
  	this.speedY += GRAVITY / 400;
  	this.sprite.y += this.speedY;

  	if (this.isCollide && this.onCollide) {
  		this.onCollide();
  	}
  };

  public reset = (): void => {
  	this.sprite.position.set(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2.5);
  	this.speedY = 0;
  };

  private static get bird():PIXI.AnimatedSprite {
  	const bird = new PIXI.AnimatedSprite([
  		PIXI.Texture.from('birdUp.png'),
  		PIXI.Texture.from('birdMiddle.png'),
  		PIXI.Texture.from('birdDown.png'),
  	]);

  	bird.loop = true;
  	bird.animationSpeed = 0.1;
  	bird.play();
  	return bird;
  }

  private addSpeed(speed: number): void {
  	this.speedY += speed;
  	this.speedY = Math.max(-GRAVITY, this.speedY);
  }

  private get isCollide(): boolean {
  	const { x, y, width, height } = this.sprite;
  	if (this.wall.checkCollision(x - width / 2, y - height / 2, width, height))
  		return true;
  	return y < -height / 2 || y > CANVAS_HEIGHT + height / 2;
  }
}

export default Player;
