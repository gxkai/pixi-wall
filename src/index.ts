import * as PIXI from 'pixi.js';
import Wall from './wall';
import Player from './player';
import {CANVAS_WIDTH, CANVAS_HEIGHT, EventEmitter} from './constants';
import Background from './background';
import Statistics from './statistics';
import {Howl} from 'howler';
import getHowlSound from './utils/getHowlerSound';
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
  private statistics!: Statistics;

  private stage!: PIXI.Container;
  private ticker!: PIXI.Ticker;
  private flySound: Howl = getHowlSound('sfx_wing.wav', {loop: true});

  public constructor() {
  	this.loadAssets().then(() => {
  		this.stage = new PIXI.Container();
  		this.ticker = new PIXI.Ticker();
  		this.ticker.maxFPS = 60;
  		this.ticker.autoStart = false;
  		this.wall = new Wall(this.stage);
  		this.player = new Player(this.stage, this.wall);
  		this.statistics= new Statistics(this.stage);
  		this.wall.on(EventEmitter.PASS_THROUGH, () => {
  			this.onPassed();
  		});
  		this.wall.on(EventEmitter.PASS_COLLISION, () => {
  			this.onCollide();
  		});
  		this.wall.on(EventEmitter.OUT_SCREEN, () => {
  			this.onOuScreen();
  		});
  		this.wall.on(EventEmitter.COIN_COLLISION, (score) => {
  			this.statistics.plus(score);
  		});
  		this.statistics.on(EventEmitter.PASS_SPEED, () => {
  			this.onSpeed();
  		});

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
  	this.statistics.update();
  };

  public start = (): void => {
  	this.ticker.start();
  	this.isPlaying = true;
  	this.flySound.play();
  };

  public reset = (): void => {
  	this.wall.reset();
  	this.player.reset();
  };

  private onOuScreen = (): void=> {
  	this.statistics.clear();
  	this.onCollide();
  }
  private onCollide = (): void => {
  	if (this.statistics.score === 0) {
  		this.ticker.stop();
  		this.isPlaying = false;
  		this.wall.reset();
  		this.flySound.stop();
  	} else {
  		this.statistics.minus();
  	}
  };

  private onPassed = (): void => {
  	this.statistics.plus();
  }

  private onSpeed = (): void => {
  	this.wall.changeSpeed( Math.floor(this.statistics.score / 10));
  }
}

const game = new Game();

const startButton = document.createElement('button');
startButton.textContent = 'START';
startButton.onclick = (): void => {
	game.reset();
	game.start();
};
document.body.appendChild(startButton);
