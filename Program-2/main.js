var oneState  = {

	//Preload images
    preload: function() {
        game.load.image('player', 'assets/neoshad.png');
        game.load.image('wallV', 'assets/wallVertical.png');
        game.load.image('wallH', 'assets/wallHorizontal.png');
        game.load.image('coin', 'assets/Retro Coin.png');
        game.load.image('enemy', 'assets/rednoct.png');
    },

	//Create
    create: function() { 
		
        game.stage.backgroundColor = '#3498db';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;

        this.cursor = game.input.keyboard.createCursorKeys();
        
        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
		
		//scale image to appropriate size
		this.player.scale.y = 0.6
		this.player.scale.x = 0.6
		
		
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.createWorld();

        this.coin = game.add.sprite(60, 140, 'coin');
		
		//scale coin to appropriate size
		this.coin.scale.y = 0.5
		this.coin.scale.x = 0.5
		
		
		//console.log(this.coin);
        game.physics.arcade.enable(this.coin); 
        this.coin.anchor.setTo(0.5, 0.5);

		
		//score label
        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
        this.score = 0;
		
		//timer label
		//timer is sixty times number of seconds cause game runs at sixty FPS
		this.time = 60*120;
		this.timer = game.add.text(game.width-40, 30, this.time, { font: '18px Arial', fill: '#ffffff' });
		
		//death counter label
		this.deathcounterLabel = game.add.text(game.width-40, game.height-40, '0', { font: '18px Arial', fill: '#ffffff' });
		this.deathcounter = 0;
		
		//Uses to set invincibility frames
		this.iframes = false;
		this.icounter = 0;

		
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.collide(this.enemies, this.walls);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
		
		//if player has no invincibility frames
		if(!this.iframes)
			//see if colliding with enemy
			game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
		else
			//since we have invincibility frames, decrement counter
			this.icounter--;
		
		//if the counter runs out, we do not have i-frames
		if (this.icounter == 0)
			this.iframes = false;

        this.movePlayer(); 
		
		//Decrement counter
		this.time -= 1;
		//Round down counter to integers
		this.timer.text = Math.round(this.time/60);
		
		//When the time is up, restart the game.
		if(this.time == -1)
		{
			game.state.start('main');
		}
		
		//If player falls out of game call player respawn
        if (!this.player.inWorld) {
            this.playerRespawn();
        }
    },

    movePlayer: function() {
        if (this.cursor.left.isDown) {
			//scale x-axis so that player faces left
			this.player.scale.x = 0.6
            this.player.body.velocity.x = -200;
        }
        else if (this.cursor.right.isDown) {
			//scale x-axis so that player faces right
			this.player.scale.x = -0.6
            this.player.body.velocity.x = 200;
        }
        else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -320;
        }      
    },

    takeCoin: function(player, coin) {
        this.score += 5;
        this.scoreLabel.text = 'score: ' + this.score;

        this.updateCoinPosition();
    },

    updateCoinPosition: function() {
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, 
            {x: 60, y: 140}, {x: 440, y: 140}, 
            {x: 130, y: 300}, {x: 370, y: 300} 
        ];

        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x == this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }

        var newPosition = game.rnd.pick(coinPosition);
        this.coin.reset(newPosition.x, newPosition.y);
    },

    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();

        if (!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.width/2, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },

    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls); 
        game.add.sprite(480, 0, 'wallV', 0, this.walls); 
        game.add.sprite(0, 0, 'wallH', 0, this.walls); 
        game.add.sprite(300, 0, 'wallH', 0, this.walls);
        game.add.sprite(0, 320, 'wallH', 0, this.walls); 
        game.add.sprite(300, 320, 'wallH', 0, this.walls); 
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); 
        game.add.sprite(400, 160, 'wallH', 0, this.walls); 
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    },

    playerDie: function() {
        //game.state.start('main');
		
		//increment death counter
		this.deathcounter += 1;
		this.deathcounterLabel.text = this.deathcounter;
		
		//set invincibility frames
		this.iframes = true;
		this.icounter = 5;
    },
	
	playerRespawn: function() {
        //game.state.start('main');
		var playerPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, 
            {x: 60, y: 140}, {x: 440, y: 140}, 
            {x: 130, y: 300}, {x: 370, y: 300}
			];
		
		//pick a random new position
		var newposition = game.rnd.pick(playerPosition);
		//reset the player with that position
		this.player.reset(newposition.x, newposition.y)
		//increment death counter and grant invincibility frames
		this.playerDie();
    },
	
};

var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');