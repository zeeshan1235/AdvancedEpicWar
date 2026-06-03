const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
};
const game = new Phaser.Game(config);
let playerTank;
function preload() {
    this.load.image('tank', 'https://labs.phaser.io/assets/sprites/tank.png');
}
function create() {
    this.add.text(20, 20, 'Phaser.js War Engine Active - Ready for Combat', { fill: '#0f0', fontSize: '20px' });
    playerTank = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'tank');
    playerTank.setCollideWorldBounds(true);
}
function update() {
    playerTank.angle += 0.5; // Placeholder auto-rotation testing
}
