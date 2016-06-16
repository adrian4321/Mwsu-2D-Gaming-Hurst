var menuState = {
    create: function() {
        // Add a background image
        game.add.image(0, 0, 'background');
        // Display the name of the game
        var nameLabel = game.add.text(game.width/2, -50, 'Super Coin Box', { font: '50px Arial', fill: '#ffffff' });
		// Create a tween on the label
		var tween = game.add.tween(nameLabel);
		tween.to({y: 80}, 1000);
		tween.start();
		game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();

        nameLabel.anchor.setTo(0.5, 0.5);
        // Show the score at the center of the screen
        var text = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');
		var scoreLabel = game.add.text(game.width/2, game.height/2, text, { font: '25px Arial', fill: '#ffffff', align: 'center' });
        scoreLabel.anchor.setTo(0.5, 0.5);
        // Explain how to start the game
        var startLabel = game.add.text(game.width/2, game.height-80,
            'press the up arrow key to start',
            { font: '25px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        // Create a new Phaser keyboard variable: the up arrow key
        // When pressed, call the 'start' function once
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.start, this);
		// If 'bestScore' is not defined
		// It means that this is the first time the game is played
		if (!localStorage.getItem('bestScore')) {
			// Then set the best score to 0
			localStorage.setItem('bestScore', 0);
		}
		// If the score is higher than the best score
		if (game.global.score > localStorage.getItem('bestScore')) {
			// Then update the best score
			localStorage.setItem('bestScore', game.global.score);
		}
		// Add the button that calls the 'toggleSound' function when pressed
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound,this);
    },
    start: function() {
        // Start the actual game
        game.state.start('play');
    },
	// Function called when the 'muteButton' is pressed
	toggleSound: function() {
    // Switch the variable from true to false, or false to true
    // When 'game.sound.mute = true', Phaser will mute the game
    game.sound.mute = !game.sound.mute;
    // Change the frame of the button
    this.muteButton.frame = game.sound.mute ? 1 : 0;
},
};