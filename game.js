/*faire import*/

class Game {
    constructor (map, player1, player2)
    {
        this.map = map;
        this.player1 = new Player(player1, "p1.png", this);
        this.player2 = new Player(player2, "p2.png", this);
        this.weapons = this.map.initweapons();
        this.allCells = document.querySelector('table');
    }

    initPlayer(game, panel1, panel2){
        this.player1.enemy = this.player2;
        this.player1.playerTurn = true;
        this.player1.panel = panel1

        this.player2.enemy = this.player1;
        this.player2.playerTurn = false;
        this.player2.panel = panel2;
    }

    initGame()
    {
        this.player1.placePlayer();
        this.player2.placePlayer();

        const btnStart = document.getElementById('gameStart');
        const that = this;
   
        btnStart.addEventListener('click', function(e){
            e.preventDefault();
            that.player1.playerPlay();
        });
    }
}

// construit la map
const gameMap = new Map(6, 5);
gameMap.buildMap();
gameMap.disableCells();

// créer la classe game qui va créer les joueurs
const game = new Game(gameMap, "Luke", "Marie");

// créer l'affichage des infos joueur
const panel1 = new Panel(document.getElementById('displayPlayer1'), game.player1);
const panel2 = new Panel(document.getElementById('displayPlayer2'), game.player2);

game.initPlayer(game, panel1, panel2);
game.initGame();

// affiche les infos joueurs
panel1.displayPlayer();
panel2.displayPlayer();
