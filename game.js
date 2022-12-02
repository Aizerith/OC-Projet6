/*faire import*/

class Game {
    constructor (map, player1, player2)
    {
        this.map = map;
        this.player1 = new Player(player1, "p1.png", true);
        this.player2 = new Player(player2, "p2.png", false);
        this.weapons = this.map.initweapons();
        this.allCells = document.querySelector('table');
    }

    /*/ mettre dans player
    playerPlay(player)
    {
        //2 si ya combattant a cote se battre sinon se deplacer
        //3 reinitialiser le tour du joueur
        let movableCells = player.getMovableCells(player.curX, player.curY, this.map.nb, this.map.rows)
        player.showMovableCells(movableCells);
        const that = this;

        movableCells.forEach(cell=>{
            cell.addEventListener('click', function(e){
                e.preventDefault();
                console.log(this.cellIndex, this.parentNode.rowIndex);
                if(player.playerTurn){
                        player.movePlayer(this.cellIndex, this.parentNode.rowIndex, that.allCells, movableCells);
                        player.playerTurn = false;
                        player.enemy.playerTurn = true;
                        player.unshowMovableCells(movableCells);
                }
            });
        })
    }*/

    initPlayer(game, panel1, panel2){
        this.player1.game = game;
        this.player1.enemy = this.player2;
        this.player1.playerTurn = true;
        this.player1.panel = panel1

        this.player2.game = game;
        this.player2.enemy = this.player1;
        this.player2.playerTurn = false;
        this.player2.panel = panel2;
    }

    initGame()
    {
        this.player1.placePlayer(this.map.nb, this.map.rows);
        this.player2.placePlayer(this.map.nb, this.map.rows);

        const btnStart = document.getElementById('gameStart');
        const that = this;
   
        btnStart.addEventListener('click', function(e){
            e.preventDefault();
            if (that.player1.playerTurn){
                that.player1.playerPlay(that.map, that.allCells);
            }
            else{
                that.player2.playerPlay(that.map, that.allCells);
            }
        });
    }
}

// construit la map
const gameMap = new Map('#map-container', 6, 5);
gameMap.buildMap();
gameMap.disableCells();

// créer la classe game qui va créer les joueurs
const game = new Game(gameMap, "Luke", "Marie");


// créer l'affichage des infos joueur
const panel1 = new Panel(document.getElementById('displayPlayer1'), game.player1);
const panel2 = new Panel(document.getElementById('displayPlayer2'), game.player2);

game.initPlayer(game, panel1, panel2);
game.initGame();

panel1.displayPlayer();
panel2.displayPlayer();
