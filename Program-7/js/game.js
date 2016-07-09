var game = new Phaser.Game(500, 340, Phaser.AUTO, '');

game.global = {
    score: 0
};

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('Level2', Level2);

game.state.start('boot');