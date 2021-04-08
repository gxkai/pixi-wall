import * as PIXI from 'pixi.js';
import Wall from './wall';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY } from './constants';

class Player {
  private sprite = Player.bird;
  private speedY = 0;
  private readonly wall: Wall;

  public constructor(
  	stage: PIXI.Container,
  	wall: Wall,
  ) {
  	this.reset();

  	this.wall = wall;

  	this.sprite.pivot.set(this.sprite.width / 2, this.sprite.height / 2);

  	document.addEventListener('keydown', (event: KeyboardEvent): void => {
  		event.preventDefault();
  		if (event.key === ' ') {
  			this.addSpeed(-GRAVITY / 10);
  		}
  	});
  	document.addEventListener('mousedown', (event: MouseEvent): void => {
  		event.preventDefault();
  		this.addSpeed(-GRAVITY / 10);
  	});
  	stage.addChild(this.sprite);
  }

  public update = (): void => {
  	this.speedY += GRAVITY / 400;
  	this.sprite.y += this.speedY;
  	const { x, y, width, height } = this.sprite;
  	this.wall.checkCollision(x, y, width, height);
  	this.wall.checkPassed(x, y, width, height);
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
}

export default Player;
