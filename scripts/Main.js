import { Map } from "../module/Map.js";
import { Panel } from "../module/Panel.js";
import { Game } from "../module/Game.js";

// vérification taille d'écran
let windowSize;
$(window).on('resize', function(){
    windowSize = $(window).width();
    if(windowSize <= 400){
        alert("Taille d'écran trop petit pour jouer de manière optimal!");
    }
});

// construit la map
const gameMap = new Map(6, 5);
gameMap.buildMap();
gameMap.disableCells();

// créer la classe game qui va créer les joueurs
const game = new Game(gameMap, "Luke", "Marie");

// créer l'affichage des infos joueur
const panel1 = new Panel(document.getElementById('player1Panel'), game.player1);
const panel2 = new Panel(document.getElementById('player2Panel'), game.player2);

// initialise les parametre des joueurs
game.initPlayer(panel1, panel2);

// initialise le jeu
game.initGame();

// affiche les infos joueurs
panel1.displayPlayerInfo();
panel2.displayPlayerInfo();
