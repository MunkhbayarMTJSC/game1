import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 300

const gameStartDiv = document.querySelector('#gameStartDiv');
const gameStartBtn = document.querySelector('#gameStartBtn');
const gameEndDiv = document.querySelector('#gameEndDiv');
const gameWinLoseSpan = document.querySelector('#gameWinLoseSpan');
const gameEndScoreSpan = document.querySelector('#gameEndScoreSpan');


class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.point;
    this.textScore
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.coinMusic;
    this.bgMusic;
    this.emiter;
    this.leftButton;
    this.rightButton;
  }

  preload() {
    this.load.image('bg', 'assets/bg.png');
    this.load.image('basket', 'assets/basket.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('particle', 'assets/money.png');
    this.load.audio('bgMusic', 'assets/bgMusic.mp3');
    this.load.audio('coin', 'assets/coin.mp3');
    this.load.image('left', 'assets/left-arrow.png');
    this.load.image('right', 'assets/right-arrow.png');
  }

  create() {
    this.isLeftDown = false;
    this.isRightDown = false;
    this.point = 0;
    this.coinMusic = this.sound.add('coin');
    this.bgMusic = this.sound.add('bgMusic');
    this.bgMusic.play({ loop: true });

    this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.player = this.physics.add.image(0, sizes.height - 100, 'basket').setOrigin(0, 0);
    this.target = this.physics.add.image(0, 0, 'heart').setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(this.player.width - this.player.width/4, this.player.height/6).setOffset(this.player.width/10, this.player.height-this.player.height/10);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);
    
    this.cursor = this.input.keyboard.createCursorKeys();
    this.textScore = this.add.text(sizes.width - 20, 10, '❤️ ', {
      font: '25px Courier New',
      color: '#FFD700',
      stroke: '#000',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 4,
        stroke: true,
        fill: true
      }
    });
    this.textScore.setOrigin(1, 0);

    this.textTime = this.add.text(20, 10, '⏰ 00', {
      font: '25px Courier New',
      color: '#00BFFF',
      stroke: '#000',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 4,
        stroke: true,
        fill: true
      }
    });
    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this);
    this.emiter = this.add.particles(0, 0, 'particle', {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.1,
      duration: 100,
      emitting: false,
    });
    
    this.leftButton = this.add.circle(60, 440, 35, 0x000000, 0.4)
      .setInteractive()
      .on('pointerdown', () => this.isLeftDown = true)
      .on('pointerup', () => this.isLeftDown = false)
      .on('pointerout', () => this.isLeftDown = false)
      .on('pointerdown', () => {
        this.tweens.add({
          targets: this.leftButton,
          scale: 0.9,
          duration: 100,
          yoyo: true,
          ease: 'Power1'
        });
        this.player.setVelocityX(-this.playerSpeed);
      }); // Хуруу гарсан үед зогсоох

      this.rightButton = this.add.circle(440, 440, 35, 0x000000, 0.4)
      .setInteractive()
      .on('pointerdown', () => this.isRightDown = true)
      .on('pointerup', () => this.isRightDown = false)
      .on('pointerout', () => this.isRightDown = false)
      .on('pointerdown', () => {
        this.tweens.add({
          targets: this.rightButton,
          scale: 0.9,
          duration: 100,
          yoyo: true,
          ease: 'Power1'
        });
        this.player.setVelocityX(-this.playerSpeed);
      });
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`⏰ ${Math.round(this.remainingTime).toString()}`);
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;
    if (left.isDown || this.isLeftDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown || this.isRightDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }


    this.textScore.setText(`❤️ ${this.point}`);
    this.emiter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
  }

  getRandomX() {
    return Math.floor(Math.random()*480);
  }

  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.point++;
    this.emiter.explode(10, this.player.x, this.player.y);
    this.tweens.add({
      targets: this.textScore,
      scale: 1.3,
      duration: 100,
      yoyo: true,
    });
    this.coinMusic.play();
  }
  gameOver() {
    if (this.point >= 10) {
      gameEndScoreSpan.textContent = `${this.point}❤️`;
      gameWinLoseSpan.textContent = "You Win!"
    } else {
      gameEndScoreSpan.textContent = `${this.point}❤️`;
      gameWinLoseSpan.textContent = "You Lose!"
    }
    gameEndDiv.style.display = 'flex';
    this.scene.pause();
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: false,
    },
  },
  scene: [],
};

const game = new Phaser.Game(config);
game.scene.add('scene-game', GameScene); 

gameStartBtn.addEventListener('click', ()=>{
  gameStartDiv.style.display = 'none';
  game.scene.start('scene-game');
})
gameEndDiv.addEventListener('click', () => {
  gameEndDiv.style.display = 'none';
  game.scene.stop('scene-game');
  game.scene.start('scene-game'); // Шинэ тоглоом эхэлнэ

});