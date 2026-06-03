const config = { type: Phaser.AUTO, width: window.innerWidth, height: window.innerHeight, physics: { default: 'arcade', arcade: { debug: false } }, scene: { preload: preload, create: create, update: update } };
const game = new Phaser.Game(config);
let player, enemies, bullets, particles, bg, score = 0, highScore = localStorage.getItem('epicHighScore') || 0, scoreText, highScoreText, stateText, gameState = 'START', lastFired = 0, spawnTimer;
function preload() {
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/xwing.png');
    this.load.image('enemy1', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
    this.load.image('enemy2', 'https://labs.phaser.io/assets/sprites/ufo.png');
    this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullets/bullet1.png');
    this.load.image('flare', 'https://labs.phaser.io/assets/particles/red.png');
}
function create() {
    bg = this.add.tileSprite(window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight, 'bg');
    particles = this.add.particles(0, 0, 'flare', { speed: 100, scale: { start: 0.5, end: 0 }, blendMode: 'ADD', lifespan: 300, emitting: false });
    player = this.physics.add.sprite(window.innerWidth/2, window.innerHeight - 100, 'player').setScale(0.8);
    player.setCollideWorldBounds(true);
    bullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, maxSize: 100, runChildUpdate: true });
    enemies = this.physics.add.group();
    scoreText = this.add.text(10, 10, 'SCORE: 0', { fontSize: '28px', fill: '#0ff', fontStyle: 'bold' });
    highScoreText = this.add.text(10, 40, 'HIGH SCORE: ' + highScore, { fontSize: '20px', fill: '#ff0' });
    stateText = this.add.text(window.innerWidth/2, window.innerHeight/2, 'TAP TO START ULTIMATE WAR', { fontSize: '32px', fill: '#fff', fontStyle: 'bold', align: 'center' }).setOrigin(0.5);
    
    this.input.on('pointerdown', () => {
        if (gameState === 'START' || gameState === 'GAMEOVER') {
            gameState = 'PLAY'; score = 0; scoreText.setText('SCORE: 0'); stateText.setVisible(false); enemies.clear(true, true);
            player.setPosition(window.innerWidth/2, window.innerHeight - 100); player.setVisible(true); player.body.enable = true;
            if(spawnTimer) spawnTimer.remove();
            spawnTimer = this.time.addEvent({ delay: 800, callback: spawnEnemy, callbackScope: this, loop: true });
        }
    });
    this.input.on('pointermove', (pointer) => { if (gameState === 'PLAY' && pointer.isDown) { player.x = pointer.x; player.y = pointer.y - 40; } });
    
    this.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
        bullet.destroy(); particles.emitParticleAt(enemy.x, enemy.y, 15); enemy.destroy();
        score += (enemy.texture.key === 'enemy2' ? 20 : 10); scoreText.setText('SCORE: ' + score);
    }, null, this);
    
    this.physics.add.overlap(player, enemies, () => {
        particles.emitParticleAt(player.x, player.y, 50); player.setVisible(false); player.body.enable = false;
        gameState = 'GAMEOVER'; spawnTimer.remove(); stateText.setText('GAME OVER\nTAP TO RESTART').setVisible(true);
        if (score > highScore) { highScore = score; localStorage.setItem('epicHighScore', highScore); highScoreText.setText('HIGH SCORE: ' + highScore); }
    }, null, this);
}
function spawnEnemy() {
    if (gameState !== 'PLAY') return;
    let type = Phaser.Math.Between(1, 10) > 7 ? 'enemy2' : 'enemy1';
    let enemy = enemies.create(Phaser.Math.Between(50, window.innerWidth - 50), -50, type);
    enemy.setVelocityY(Phaser.Math.Between(150, 400));
}
function update(time) {
    bg.tilePositionY -= 2;
    if (gameState === 'PLAY' && this.input.activePointer.isDown && time > lastFired) {
        let bullet = bullets.get(player.x, player.y - 40, 'bullet');
        if (bullet) { bullet.setActive(true).setVisible(true).setScale(1.5); bullet.body.velocity.y = -800; lastFired = time + 100; }
    }
}
