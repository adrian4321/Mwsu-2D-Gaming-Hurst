

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

//create global variables
//global two dimensional array map
var map = [];

//length and width 
var XY = 12;

//tile size from tile map
var tileSize = 20;

//for map drawing
var mazeGraphics;



function preload() {

    //  tiles are 16x16 each
    game.load.image('tiles', 'assets/images/tileset.png');

}


function create()
{
	//game.add.graphics
	mazeGraphics = game.add.graphics(0, 0);
	//console.log(mazeGraphics);
  
	//moves stack
	this.moves = [];

	//generate map array
	for(var i = 0; i < XY; i++)
	{
		map[i] = [];
		for(var j = 0; j < XY; j++)
		{
			map[i][j] = 0;
		}
	}

	//Always start in upper right hand corner
	this.posX = 1;
	this.posY = 1;

	//set first postion to white
	map[this.posX][this.posY] = 1; 
	this.moves.push(this.posY + this.posY * this.XY);
	game.time.events.loop(Phaser.Timer.SECOND/25, plot , this);
	
};

//update function
function update() {
};


function plot()
{
	if(this.moves.length)
	{   
		//init string of possible directions
		var possibleDirections = "";
		
		//if one step south is withing bounds and this postion is not visited,
		if(this.posX+2 > 0 && this.posX + 2 < XY - 1 && map[this.posX + 2][this.posY] == 0)
		{
			//we can visit it
			possibleDirections += "S";
		}
		//if one step north is withing bounds and this postion is not visited,
		if(this.posX-2 > 0 && this.posX - 2 < XY - 1 && map[this.posX - 2][this.posY] == 0)
		{
			//we can visit it
			possibleDirections += "N";
		}
		//if one step west is withing bounds and this postion is not visited,
		if(this.posY-2 > 0 && this.posY - 2 < XY - 1 && map[this.posX][this.posY - 2] == 0)
		{
			//we can visit it
			possibleDirections += "W";
		}
		//if one step east is withing bounds and this postion is not visited,
		if(this.posY+2 > 0 && this.posY + 2 < XY - 1 && map[this.posX][this.posY + 2] == 0)
		{
			//we can visit it
			possibleDirections += "E";
		} 
		
		//if we have a string of directions
		if(possibleDirections)
		{
			//pick one
			var move = game.rnd.between(0, possibleDirections.length - 1);
			//perform a switch on it
			switch (possibleDirections[move])
			{
				//if North
				case "N": 
					//we visited
					map[this.posX - 2][this.posY] = 1;
					map[this.posX - 1][this.posY] = 1;
					//move our current positon
					this.posX -= 2;
					break;
				//if South
				case "S":
					//we visited
					map[this.posX + 2][this.posY] = 1;
					map[this.posX + 1][this.posY] = 1;
					//move our current position
					this.posX += 2;
					break;
				
				//if West
				case "W":
					//we visited
					map[this.posX][this.posY - 2] = 1;
					map[this.posX][this.posY - 1] = 1;
					//move our current position
					this.posY -= 2;
					break;
					
				//if East
				case "E":
					//we visited
					map[this.posX][this.posY + 2]=1;
					map[this.posX][this.posY + 1]=1;
					//move our current postion
					this.posY += 2;
					break;         
			 }
			 
			 //push this onto our moves stack
			 this.moves.push(this.posY + this.posX * XY);     
		}
		//if we don't have string of directions
		else
		{
			//backstep and look for other paths
			var back = this.moves.pop();
			this.posX = Math.floor(back / XY);
			this.posY = back % XY;
		}   
	}
	//draw the maze
	drawMaze(); 	
}



/*for the record, I really really really hate javascript */	  


function drawMaze()
{
    mazeGraphics.clear();
	//fill black
    mazeGraphics.beginFill("0xffffff");
	
	//iterate through the array and generate the map
    for(i = 0; i < XY; i++)
	{
        for(j = 0; j < XY; j++)
		{
            if(map[i][j] == 1)
			{
				mazeGraphics.drawRect(j * tileSize, i * tileSize, tileSize, tileSize);                 
            }
        }
    }   
}
