import { Weapon } from "./Weapon.js";

export class Player {
    constructor(name, imgSrc, game) {
        this.name = name;
        this.hp = 30;
        this.weapon = new Weapon("couteau", 10, 'knife.png');
        this.imgSrc = imgSrc;
        this.game = game;
        this.enemy;
        this.playerTurn;
        this.curX;
        this.curY;
        this.panel;
        this.atkMode = true;
        this.playerElt = $(`<span class="has-player" data-player="${this.name}"></span>`)
                        .css("background-image", `url(./images/${this.imgSrc})`);
    }

    //  récupère les cases a coté d'une case dans un tableau
    getCloseCells(x = this.curX, y = this.curY) {
        
        const allCells = document.querySelector('table');
        const CloseCells = [];

        // on vérifie que les cases sont dans la map avant de les rajouter
        (y > 0) ? CloseCells.push(allCells.rows[y - 1].cells[x]): "";
        (y < this.game.map.mapY - 1) ? CloseCells.push(allCells.rows[y + 1].cells[x]): "";
        (x > 0) ? CloseCells.push(allCells.rows[y].cells[x - 1]): "";
        (x < this.game.map.mapX - 1) ? CloseCells.push(allCells.rows[y].cells[x + 1]): "";
        
        return (CloseCells)
    }

    // récupération des cases déplaçable
    getMovableCells(x = this.curX, y = this.curY, mapX = this.game.map.mapX, mapY = this.game.map.mapY) {
        const allCells = document.querySelector('table');
        const movableCells = [];
        let moveX = 1;
        let moveY = 1;
        let newCell;

        // case de départ
        newCell = allCells.rows[y].cells[x];
        movableCells.push(newCell);
        

        // verification et ajout cases du haut
        for (let i = 0; i < 3; i++) {
            if (y - moveY >= 0){
                newCell = allCells.rows[y - moveY].cells[x];
                if (!newCell.classList.contains('disabled') &&
                    !newCell.classList.contains('has-player')) {
                    movableCells.push(newCell);
                    moveY++;
                }
            }
        }

        // verification et ajout cases du bas
        moveY = 1;
        for (let i = 0; i < 3; i++) {
            if (y + moveY < mapY){
                newCell = allCells.rows[y + moveY].cells[x];
                if (!newCell.classList.contains('disabled') &&
                    !newCell.classList.contains('has-player')) {
                    movableCells.push(newCell);
                    moveY++;
                }
            }
        }

        // verification et ajout cases de gauche
        for (let i = 0; i < 3; i++) {
            if (x - moveX >= 0){
                newCell = allCells.rows[y].cells[x - moveX];
                if (!newCell.classList.contains('disabled') &&
                    !newCell.classList.contains('has-player')) {
                    movableCells.push(newCell);
                    moveX++;
                }
            }
        }

        // verification et ajout cases de droite
        moveX = 1;
        for (let i = 0; i < 3; i++) {
            if (x + moveX < mapX){
                newCell = allCells.rows[y].cells[x + moveX];
                if (!newCell.classList.contains('disabled') &&
                    !newCell.classList.contains('has-player')) {
                    movableCells.push(newCell);
                    moveX++;
                }
            }  
        }
        return movableCells;
    }

    // ajoute les cases déplacables
    showMovableCells(movableCells) {
        movableCells.forEach(cell => {
            cell.classList.add('moveCells');
        })
    }

    // retire les cases déplaçable
    removeMovableCells(movableCells) {
        movableCells.forEach(cell => {
            cell.classList.remove('moveCells');
        })
    }

    // vérifie si la case contient une arme
    checkWeapon(selectedCell) {
        if (selectedCell.classList.contains('has-weapon'))
            return true;
        else
            return false;
    }

    // récupère l'arme
    getWeapon(newWeapon) {
        let playerWeapon;
        this.game.weapons.forEach(weapon => {
            if (weapon.name == newWeapon) {
                playerWeapon = weapon;
            }
        })
        return playerWeapon;
    }

    // échange l'arme du joueur avec celui récupé
    switchWeapon(startCell, newCell) {
        startCell = $(startCell);
        const newWeapon = $(newCell).find('span').attr('data-weapon');

        // on dépose l'arme sur la case de départ
        startCell.addClass('has-weapon');
        this.weapon.weaponElt.css("background-image", `url(./images/${this.weapon.imgSrc})`);
        startCell.append(this.weapon.weaponElt);
        
        // on change l'arme du player par la nouvelle arme
        this.weapon = this.getWeapon(newWeapon);

        // on retire la nouvelle arme de la map
        newCell.classList.remove('has-weapon');
        if (newCell.firstChild) {
            newCell.removeChild(newCell.firstChild);
        }

        // on met a jour les infos du joueur
        this.panel.refreshPanel();
    }

    // recupère le mode choisi
    getAtkMode() {
        const atkMode = document.getElementsByName("fight-mode");

        for(let i = 0; i < atkMode.length; i++) {
            if(atkMode[i].checked){
                return atkMode[i].value;
            }
        }
    }

    // initie le combat
    initFight(){

        // affiche le modale de combat
        this.game.fightModal.initFightModal(this);
        $(".modal-container").addClass("active");
    
        // demmande de choix de mode
        this.game.fightModal.displayMessage(`${this.name} doit choisir un mode`);

        // modifie le mode de combat du joueur
        const modeChoice = $('#confirm-choice');
        const that = this;
        modeChoice.on('click', function(e) {
            e.preventDefault();
            if(that.getAtkMode() == "attack") {
                that.atkMode = true;
                that.fight();
            } else if(that.getAtkMode() == "defense") {
                that.atkMode = false;
                that.fight();
            } else {
                that.game.fightModal.displayMessage(`Erreur: ${that.name} doit choisir un mode`);
            }
        });
    }

    // lance le combat
    fight() {
        // réduit les pv en fonction du mode des joueurs
        if (this.enemy.atkMode && this.atkMode) {
        this.enemy.hp = this.enemy.hp - this.weapon.damage;
        } else if(!this.enemy.atkMode && this.atkMode) {
        this.enemy.hp = this.enemy.hp - (this.weapon.damage / 2);
        }
        
        // met à jour le panneau du joueur attaqué
        this.enemy.panel.refreshPanel();
        
        // si pv à 0, met fin au jeu
        if (this.hp <= 0 || this.enemy.hp <= 0) {
            this.game.endGame(this.name);
            return;
        }

        // change le tour des joueurs
        this.playerTurn = false;
        this.enemy.playerTurn = true;
        this.enemy.playerPlay();
    }

    // lance le déplacement du joueur en cours
    playerPlay() {
        if (!this.playerTurn) {
            return;
        }
        // si ennemi à coté initie le combat
        if (this.checkClosePlayer()){
            this.initFight();
        }
        // sinon lance le déplacement
        else {
            this.arrowMove(this.game.allCells, 0);
        }
    }

    // vérifie s'il y a des joueurs à coté
    checkClosePlayer() {
        const closeCells = this.getCloseCells();
        let hasWarrior = false;
        closeCells.forEach(el => {
            if (el && el.classList.contains('has-player')) {
                hasWarrior = true;
            }
        })
        return hasWarrior;
    }

    // place le joueur sur la map après la création
    placePlayer() {
        const allCells = document.querySelectorAll('.allMap');
        let selectedCell = allCells[Math.floor(Math.random() * allCells.length)];
        this.curX = selectedCell.cellIndex;
        this.curY = selectedCell.parentNode.rowIndex;

        // place le joueur sur la case
        const placePlayerInCell = (cell, player) => {
            cell.classList.add('has-player');
            player.appendTo(cell);
        };

        // on vérifie qu'il est possible de placer le joueur sur la case
        if (!this.checkClosePlayer() &&
            !selectedCell.classList.contains("has-player") &&
            !selectedCell.classList.contains("has-weapon") &&
            !selectedCell.classList.contains("disabled")) {
                placePlayerInCell(selectedCell, this.playerElt);
        }
        else {
            this.placePlayer();
        }
    }

    // action pour déplacment
    moveActions(startCell, newCell)
    {
        // on verifie s'il y a une arme
        if (this.checkWeapon(newCell)) {
            this.switchWeapon(startCell, newCell);
            }
            // on nettoie l'ancienne cellule
            startCell.classList.remove("has-player");
            if (startCell.childNodes[0]) {
            startCell.childNodes[0].remove();
            }
            // on se deplace
            newCell.classList.add("has-player");
            this.playerElt.appendTo(newCell);

            //on redefini la position du joueur
            this.curX = newCell.cellIndex;
            this.curY = newCell.parentNode.rowIndex;
    }

    // déplacement au clavier
    arrowMove(allCells, count) {

    // Variables définies 1 fois lors de l'appel de la méthode
        const that = this;
        let startCell = allCells.rows[this.curY].cells[this.curX];
        startCell.focus();
        const movableCells = this.getMovableCells();
        this.showMovableCells(movableCells);

        //fonction appelée à chaque keydown
        function move(e) {
            e.preventDefault();
            if (!that.playerTurn) {
                return;
            }

            const key = e.key;
        
            //Si touche ENTRER = fin du tour du joueur
            if (key == "Enter") {
                //FIN DE TOUR
                //met à jour tour des joueurs
                that.playerTurn = false;
                that.enemy.playerTurn = true;
                document.removeEventListener("keyup", move); //je supprime l'écouteur d'événement actuel
                that.removeMovableCells(movableCells); // retire les cases déplacables
                that.enemy.playerPlay(); //au tour de l'autre
                return;
            }

            //(re)définir la cellule de départ pour chaque mouvement
            startCell = allCells.rows[that.curY].cells[that.curX];
            startCell.focus();
        
            //Définir les variables
            const start = document.activeElement;
            let startX = start.cellIndex;
            let startY = start.parentNode.rowIndex;
            let newX = startX;
            let newY = startY;
            let newCell;
        
            //Définir les positions
            switch (key) {
                case "ArrowUp":
                newY = startY - 1;
                break;
                case "ArrowDown":
                newY = startY + 1; 
                break;
                case "ArrowLeft":
                newX = startX - 1; 
                break;
                case "ArrowRight":
                newX = startX + 1;
                break;
                default:
                return;
            }
        
            //définir la nouvelle cellule
            newCell = allCells.rows[newY].cells[newX];
            const isNewCellMovable =
                newCell != "undefined" && newCell.classList.contains('enable') && newCell.classList.contains('moveCells')
                ? true
                : false;
        
            //  Si elle est libre je me deplace
            if (isNewCellMovable) {
                count++;
                that.moveActions(startCell, newCell);
                if (that.checkClosePlayer()){
                    that.initFight();
                    document.removeEventListener("keyup", move);
                }      
            } else {
                newCell = startCell;
            }
        
            //RESET FOCUS
            newCell.focus();
        
            //A la fin du déplacement, Je vérifie si on change de joueur
            if (count >= 3 && !that.checkClosePlayer()) {

                //met à jour tour joueur
                that.playerTurn = false;
                that.enemy.playerTurn = true;

                document.removeEventListener("keyup", move);
                that.removeMovableCells(movableCells);
                that.enemy.playerPlay();
            }
        } //end move()
        document.addEventListener("keyup", move, false);
    } //end arrowMove()
}