import { Player } from "./Player.js";
import { Modal } from "./Modal.js";

export class Game {
    constructor (map, player1, player2)
    {
        this.map = map;
        this.player1 = new Player(player1, "p1.png", this);
        this.player2 = new Player(player2, "p2.png", this);
        this.weapons = this.map.initweapons(); //tableau contenant les armes
        this.allCells = document.querySelector('table');
        this.fightModal = new Modal(document.querySelector(".modal-container"));
    }

    // initialise les parametres des joueur
    initPlayer(panel1, panel2){
        this.player1.enemy = this.player2;
        this.player1.playerTurn = true;
        this.player1.panel = panel1;

        this.player2.enemy = this.player1;
        this.player2.playerTurn = false;
        this.player2.panel = panel2;
    }

    // initialise le jeu
    initGame()
    {
        // place les joueur sur la map
        this.player1.placePlayer();
        this.player2.placePlayer();

        const that = this;

        // lance le jeu quand on click sur le bouton "start"
        $('#gameStart').on('click', function(e){
            e.preventDefault();

            // lance le tour du joueur 1
            that.player1.playerPlay();
            
            // cache le bouton start
            $('#gameStart').css('display', 'none');
        });
    }

    // termine le jeu
    endGame(player)
    {
        // Affiche le message de fin de jeu
        this.fightModal.endGameMessage(player);

        // option rejouer
        $('#replay').on('click', function(e) {
            e.preventDefault();
            window.location.reload();
        });
        return;
    }
}