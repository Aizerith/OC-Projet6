class Player {
    constructor(name, imgSrc, game) {
        this.name = name;
        this.hp = 100;
        this.weapon = new Weapon("couteau", 10, 'knife.png');
        this.imgSrc = imgSrc;
        this.game = game;
        this.enemy;
        this.playerTurn;
        this.curX;
        this.curY;
        this.panel;
        this.modal;
        this.atkMode = true;
    }

    getCloseCells(x = this.curX, y = this.curY) {
        const allCells = document.querySelector('table');
        console.log(allCells, x, y);
        const CloseCells = [];
        (y > 0) ? CloseCells.push(allCells.rows[y - 1].cells[x]): "";
        (y < this.game.map.mapY - 1) ? CloseCells.push(allCells.rows[y + 1].cells[x]): "";
        (x > 0) ? CloseCells.push(allCells.rows[y].cells[x - 1]): "";
        (x < this.game.map.mapX - 1) ? CloseCells.push(allCells.rows[y].cells[x + 1]): "";
        console.log("getclosecells:", CloseCells);
        return (CloseCells)
    }

    // récupération des cases déplaçable
    getMovableCells(x = this.curX, y = this.curY, mapX = this.game.map.mapX, mapY = this.game.map.mapY) {
        const allCells = document.querySelector('table');
        const movableCells = [];
        let moveX = 1;
        let moveY = 1;
        let newCell;

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
        console.log("movableCell:", x, y, movableCells);
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
                console.log("arme trouvé", weapon);
                playerWeapon = weapon;
            }
        })
        return playerWeapon;
    }

    // échange l'arme du joueur avec celui récupé
    switchWeapon(startCell, endCell) {

        console.log("startcell endcell", startCell, endCell);
        const newWeapon = endCell.querySelector('.has-weapon').getAttribute('data-weapon');
        console.log("newWeapon", newWeapon);
        startCell.classList.add('has-weapon');
        startCell.appendChild(this.weapon.createWeaponElt());
        this.weapon = this.getWeapon(newWeapon);
        console.log(this.weapon);
        endCell.classList.remove('has-weapon');
        endCell.removeChild(endCell.firstChild);
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

    // lance le combat
    initFight(){

        // faire les modales
        this.modal.initFightModal(this);
        const modalContainer = document.querySelector(".modal-container");
        console.log("Modale", modalContainer);
        modalContainer.classList.add("active");

        // choix du mode
        this.modal.displayMessage(`${this.name} doit choisir un mode`);
        const modeChoice = document.getElementById('confirm-choice');
        const that = this;
        modeChoice.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("valuer de that atkmode", that.getAtkMode());
            if(that.getAtkMode() == "attack") {
                console.log(that.name, "en mode", that.getAtkMode());
                that.atkMode = true;
                that.fight();
            } else if(that.getAtkMode() == "defense") {
                console.log(that.name, "en mode", that.getAtkMode());
                that.atkMode = false;
                that.fight();
            } else {
                that.modal.displayMessage(`Erreur: ${that.name} doit choisir un mode`);
            }
        });
    }

    // attaque
    fight() {
        console.log(this.name,"attack mode = ", this.atkMode, this.enemy.name, "attack mode = ", this.enemy.atkMode);
        if (this.hp <= 0 || this.enemy.hp <= 0) {
            this.modal.endGameMessage();
            const replay = document.getElementById("replay");
            replay.addEventListener("click", function(e) {
                e.preventDefault();
                window.location.reload();
            });
            return;
        }
        if (this.enemy.atkMode && this.atkMode) {
            this.enemy.hp = this.enemy.hp - this.weapon.damage;
            this.hp = this.hp - this.enemy.weapon.damage;
            console.log(this.name, this.hp, this.enemy.name, this.enemy.hp);
        } else if(this.atkMode && !this.enemy.atkMode) {
            this.enemy.hp = this.enemy.hp - (this.weapon.damage / 2);
        } else if (!this.atkMode && this.enemy.atkMode) {
            this.hp = this.hp - (this.enemy.weapon.damage / 2);
        }
        this.panel.refreshPanel();
        this.enemy.panel.refreshPanel();
        if (this.hp <= 0 || this.enemy.hp <= 0) {
            return;
        }
        this.playerTurn = false;
        this.enemy.playerTurn = true;
        this.enemy.playerPlay();
    }

    // lance le déplacement du joueur en cours
    playerPlay() {
        if (!this.playerTurn) {
            return;
        } 
        if (this.checkClosePlayer()){
            this.initFight();
        }
        else {
            //this.clickMove();
            this.arrowMove(this.game.allCells, 0);
        }
    }

    // vérifie s'il y a des joueurs à coté
    checkClosePlayer() {
        const closeCells = this.getCloseCells();
        let hasWarrior = false;
        closeCells.forEach(el => {
            if (el && el.classList.contains('has-player')) {
                console.log("test")
                hasWarrior = true;
            }
        })
        return hasWarrior;
    }

    getRandNb(length) {
        return Math.floor(Math.random() * length);
    }

    // créer l'élément joueur
    createPlayerElt() {
        const playerElt = document.createElement('span');
        playerElt.classList.add('has-player');
        playerElt.setAttribute("data-player", this.name);
        playerElt.style.backgroundImage = `url(./src/${this.imgSrc})`;

        return playerElt;
    }

    // place le joueur sur la map après la création
    placePlayer() {
        const allCells = document.querySelectorAll('.allMap');
        let selectedCell = allCells[this.getRandNb(allCells.length)];
        this.curX = selectedCell.cellIndex;
        this.curY = selectedCell.parentNode.rowIndex;

        const playerElt = this.createPlayerElt();

        const placePlayerInCell = (cell, player) => {
            cell.classList.add('has-player');
            cell.appendChild(player);
        };

        // on vérifie qu'il est possible de placer le joueur sur la case
        if (!this.checkClosePlayer() &&
            !selectedCell.classList.contains("has-player") &&
            !selectedCell.classList.contains("has-weapon") &&
            !selectedCell.classList.contains("disabled")) {
                placePlayerInCell(selectedCell, playerElt);
        }
        else {
            this.placePlayer();
        }
    }

    moveActions(startCell, newCell)
    {
        //============= 1-je verifie si arme
        if (this.checkWeapon(newCell)) {
            this.switchWeapon(startCell, newCell);
            }
            //============= 2-nettoyer ancienne cellule
            startCell.classList.remove("has-player");
            if (startCell.childNodes[0]) {
            startCell.childNodes[0].remove();
            }
            //============= 3-on se deplace
            newCell.classList.add("has-player");
            newCell.appendChild(this.createPlayerElt());
    
            //============= 4-Redefinir position :
            this.curX = newCell.cellIndex; //attention pas de this
            this.curY = newCell.parentNode.rowIndex;
    
            //============= 5- Vérifier si autre joueur à côté et combattre si oui
            if (this.checkClosePlayer()){
                this.initFight();
            }
    }

    clickMove() {
        //1 - récupérer les cases libres 
        const movableCells = this.getMovableCells();
        const startCell = this.game.allCells.rows[this.curY].cells[this.curX]; //Stocker l'ancienne cellule dans une variable au lieu de répéter à chaque fois
        this.showMovableCells(movableCells);
        const that = this;

        movableCells.forEach(cell => {

            cell.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('Click turn : ', that.playerTurn)

                if (!that.playerTurn) {
                    return;
                }
                //Supprimer la classe moveCells
                that.removeMovableCells(movableCells);

                that.moveActions(startCell, cell);

                //mettre à jour tour des joueurs
                that.playerTurn = false;
                that.enemy.playerTurn = true;
                console.log("changement de joueur");
                that.enemy.playerPlay();
            })
        })
    }

    arrowMove(allCells, count) {

    // Variables définies 1 fois lors de l'appel de la méthode
    // const table = document.querySelector("table");
        const that = this;
        let startCell = allCells.rows[this.curY].cells[this.curX];
        startCell.focus();
        const movableCells = this.getMovableCells();
        this.showMovableCells(movableCells);

        //fonction appelée à chaque keydown
        function move(e) {
            // e.preventDefault();
            if (!that.playerTurn) {
                return;
            }
        
            console.log(("starting counter for each event at : ", count));
        
            const key = e.key;
        
            //Si on a cliqué ENTRER = fin du tour du joueur
            if (key == "Enter") {
                //FIN DE TOUR
                //mettre à jour tour des joueurs
                that.playerTurn = false;
                that.enemy.playerTurn = true;
                document.removeEventListener("keyup", move); //je supprime l'écouteur d'événement actuel
                that.removeMovableCells(movableCells);
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
                //newY = newY >= 0 ? newY : 0; //On ne veut pas sortir de la zone
                break;
                case "ArrowDown":
                newY = startY + 1; //à compléter
                //newY = newY < that.game.map.mapY ? newY : newY - 1; 
                break;
                case "ArrowLeft":
                newX = startX - 1;
                //newX = newX >= 0 ? newX : 0;
                break;
                case "ArrowRight":
                newX = startX + 1; //à compléter
                //newX = newX < that.game.map.mapX ? newX : newX - 1
                break;
                default:
                return;
            }
        
            //définir la nouvelle cellule
            newCell = allCells.rows[newY].cells[newX];
            const isNewCellMovable =
                newCell != "undefined" && newCell.classList.contains("enable") && newCell.classList.contains("moveCells")
                ? true
                : false;
        
            //  Si elle est libre je me deplace
            if (isNewCellMovable) {
                count++; //j'incrémente mon compteur
        
                console.log("Player is moving with counter at ", count);
                that.moveActions(startCell, newCell);

            } else {
                console.log("Pas de déplacement possible sur cette cellule");
                newCell = startCell;//table.rows[startY].cells[startX]; //on revient en arrière
            }
        
            //RESET FOCUS
            newCell.focus();
        
            //A la fin du déplacement, Je vérifie si on change de joueur
            if (count >= 3) {
                //FIN DE TOUR
                //mettre à jour tour joueur
                that.playerTurn = false;
                that.enemy.playerTurn = true;
                console.log("changement de joueur");
                document.removeEventListener("keyup", move);
                that.removeMovableCells(movableCells);
                that.enemy.playerPlay();
            }
        } //end move()
        document.addEventListener("keyup", move, false);
    } //end arrowMove()
}