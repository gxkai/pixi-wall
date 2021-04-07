import * as PIXI from 'pixi.js';
import Wall from './wall';
import Player from './player';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import Background from './background';
(window as any) .PIXI = PIXI;
const app = new PIXI.Application({
	width: CANVAS_WIDTH,
	height: CANVAS_HEIGHT,
	backgroundColor: 0xE5FFE3
});

const mainDOM = document.querySelector('#main');
if (mainDOM) {
	mainDOM.appendChild(app.view);
}

class Game {
  public isPlaying = false;

  private player!: Player;
  private wall!: Wall;

  private stage!: PIXI.Container;
  private ticker!: PIXI.Ticker;

  public constructor() {
  	this.loadAssets().then(() => {
  		this.stage = new PIXI.Container();
  		this.ticker = new PIXI.Ticker();
  		this.ticker.autoStart = false;
  		this.wall = new Wall(this.stage);
  		this.player = new Player(this.stage, this.wall, this.onCollide);

  		this.init();
  	}).catch(() => {
  		console.log('load assets fail!!');
  	});
  }

  private loadAssets = (): Promise<void> => {
  	return new Promise((res, rej) => {
  		const loader = PIXI.Loader.shared;
  		loader.add('rabbit', 'assets/simpleSpriteSheet.json');

  		loader.onComplete.once(() => {
  			res();
  		});

  		loader.onError.once(() => {
  			rej();
  		});

  		loader.load();
  	});
  }

  private init = (): void => {
	  new Background(app.stage);
	  app.stage.addChild(this.stage);
	  this.ticker.add(this.draw);
  };

  private draw = (): void => {
  	this.wall.update();
  	this.player.update();
  };

  public start = (): void => {
  	this.ticker.start();
  	this.isPlaying = true;
  };

  public reset = (): void => {
  	this.wall.reset();
  	this.player.reset();
  };

  private onCollide = (): void => {
  	this.ticker.stop();
  	this.isPlaying = false;
  };
}

const game = new Game();

const startButton = document.createElement('button');
startButton.textContent = 'START';
startButton.onclick = (): void => {
	game.reset();
	game.start();
};
document.body.appendChild(startButton);
