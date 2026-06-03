const config = { type: Phaser.AUTO, width: window.innerWidth, height: window.innerHeight, physics: { default: 'arcade', arcade: { debug: false } }, scene: { preload: preload, create: create, update: update } };
const game = new Phaser.Game(config);
let player, enemies, bullets, score = 0, scoreText, lastFired = 0;
function preload() { this.load.image('player', 'https://labs.phaser.io/assets/sprites/player.png'); this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/space-baddie.png'); this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullet.png'); }
function create() {
    player = this.physics.add.sprite(window.innerWidth/2, window.innerHeight-100, 'player'); player.setCollideWorldBounds(true);
    bullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, maxSize: 50, runChildUpdate: true });
    enemies = this.physics.add.group();
    this.time.addEvent({ delay: 1000, callback: () => { let enemy = enemies.create(Phaser.Math.Between(50, window.innerWidth-50), 0, 'enemy'); enemy.setVelocityY(200); }, callbackScope: this, loop: true });
    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '24px', fill: '#0f0' });
    this.physics.add.overlap(bullets, enemies, (bullet, enemy) => { bullet.destroy(); enemy.destroy(); score += 10; scoreText.setText('Score: ' + score); }, null, this);
    this.physics.add.overlap(player, enemies, () => { this.scene.restart(); score = 0; }, null, this);
    this.input.on('pointermove', (pointer) => { if (pointer.isDown) { player.x = pointer.x; player.y = pointer.y; } });
}
function update(time) {
    if (this.input.activePointer.isDown && time > lastFired) {
        let bullet = bullets.get(player.x, player.y - 20, 'bullet');
        if (bullet) { bullet.setActive(true).setVisible(true); bullet.body.velocity.y = -500; lastFired = time + 150; }
    }
}
