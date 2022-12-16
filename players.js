class Player {
    constructor(name, imgSrc) {
        this.name = name;
        this.hp = 100;
        this.weapon = new Weapon("couteau", 10, 'knife.png');
        this.imgSrc = imgSrc;
        this.game;
        this.enemy;
        this.playerTurn;
        this.curX;
        this.curY;
        this.panel;
    }

    getCloseCells(x, y, mapX, mapY) {

        const allCells = document.querySelector('table');
        console.log(allCells, x, y);
        const CloseCells = [];
        (y > 0) ? CloseCells.push(allCells.rows[y - 1].cells[x]): "";
        (y < mapY - 1) ? CloseCells.push(allCells.rows[y + 1].cells[x]): "";
        (x > 0) ? CloseCells.push(allCells.rows[y].cells[x - 1]): "";
        (x < mapX - 1) ? CloseCells.push(allCells.rows[y].cells[x + 1]): "";
        console.log("getclosecells:", CloseCells);
        return (CloseCells)
    }

    /*===== NOTE MENTOR : il ne doit pas y avoir d'autre joueur dans ces cases =======*/

    getMovableCells(x, y, mapX, mapY) {
        const allCells = document.querySelector('table');
        const movableCells = [];
        let moveX = 1;
        let moveY = 1;
        for (let i = 0; i < 3; i++) {
            if (y - moveY >= 0
                && !allCells.rows[y - moveY].cells[x].classList.contains('disabled')
                && !allCells.rows[y - moveY].cells[x].classList.contains('has-player')) {
                movableCells.push(allCells.rows[y - moveY].cells[x])
                moveY++;
            }
        }
        moveY = 1;
        for (let i = 0; i < 3; i++) {
            if (y + moveY < mapY
                && !allCells.rows[y + moveY].cells[x].classList.contains('disabled')
                && !allCells.rows[y + moveY].cells[x].classList.contains('has-player')) {
                movableCells.push(allCells.rows[y + moveY].cells[x])
                moveY++;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (x - moveX >= 0
                && !allCells.rows[y].cells[x - moveX].classList.contains('disabled')
                && !allCells.rows[y].cells[x - moveX].classList.contains('has-player')) {
                movableCells.push(allCells.rows[y].cells[x - moveX])
                moveX++;
            }
        }
        moveX = 1;
        for (let i = 0; i < 3; i++) {
            if (x + moveX < mapX
                && !allCells.rows[y].cells[x + moveX].classList.contains('disabled')
                && !allCells.rows[y].cells[x + moveX].classList.contains('has-player')) {
                movableCells.push(allCells.rows[y].cells[x + moveX])
                moveX++;
            }
        }
        console.log("movableCell:", x, y, movableCells);
        return movableCells;
    }

    showMovableCells(movableCells) {
        movableCells.forEach(cell => {
            cell.classList.add('moveCells');
        })
    }

    removeMovableCells(movableCells) {
        movableCells.forEach(cell => {
            cell.classList.remove('moveCells');
        })
    }

    checkWeapon(selectedCell) {
        if (selectedCell.classList.contains('has-weapon'))
            return true;
        else
            return false;
    }

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

    startCombat() {
        console.log("COMBAT!!");
        if (this.hp <= 0 || this.enemy.hp <= 0) {
            return;
        }
        if (this.enemy.atkMode) {
            this.enemy.hp = this.enemy.hp - this.weapon.damage;
            this.hp = this.hp - this.enemy.weapon.damage;
        } else {
            this.enemy.hp = this.enemy.hp - (this.weapon.damage / 2);
        }
    }

    playerPlay(map, allCells) {
        if (!this.playerTurn) {
            return
        } else {
           // this.movePlayer(allCells, map);
           this.arrowMove(allCells, map);
        }
    }

    // vérifie s'il y a des joueurs à coté
    checkClosePlayer(x = this.curX, y = this.curY, mapX, mapY) {
        const closeCells = this.getCloseCells(x, y, mapX, mapY);
        let hasWarrior = false;
        closeCells.forEach(el => {
            if (el && el.classList.contains('has-player')) {
                console.log("test")
                hasWarrior = true;
            }
        })
        return hasWarrior
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
    placePlayer(mapX, mapY) {
        const allCells = document.querySelectorAll('.allMap');
        let selectedCell = allCells[Math.floor(Math.random() * allCells.length)];
        this.curX = selectedCell.cellIndex;
        this.curY = selectedCell.parentNode.rowIndex;

        const playerElt = this.createPlayerElt();

        const placePlayerInCell = (cell, player) => {
            cell.classList.add('has-player');
            cell.appendChild(player);
        };

        if (
            !this.checkClosePlayer(this.curX, this.curY, mapX, mapY) &&
            !selectedCell.classList.contains("has-player") &&
            !selectedCell.classList.contains("has-weapon") &&
            !selectedCell.classList.contains("disabled")
        ) {
            placePlayerInCell(selectedCell, playerElt);
        } else {
            this.placePlayer();
        }
    }

    getGame(game) {
        this.game = game;
    }

    /*===== INTERVENTION MENTOR =======*/
    movePlayer(allCells, map) {
        //1 - récupérer les cases libres 
        const movableCells = this.getMovableCells(this.curX, this.curY, map.nb, map.rows);
        const oldCell = allCells.rows[this.curY].cells[this.curX];//Stocker l'ancienne cellule dans une variable au lieu de répéter à chaque fois
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

                //Définir la nouvelle celleule = inutile c'est cell on vient de cliquer dessus !
                //const newCell = allCells.rows[this.parentNode.rowIndex].cells[this.cellIndex];

                //Vérifier pour une arme
                if (that.checkWeapon(cell)) {
                    that.switchWeapon(oldCell, cell);
                }

                //Nettoyer ancienne cellule
                oldCell.classList.remove('has-player');
                oldCell.removeChild(oldCell.firstChild);

                //Déplacer le joueur dans la case                
                const playerElt = that.createPlayerElt();
                cell.classList.add("has-player");
                cell.appendChild(playerElt);
                
                //mettre à jour la position curX et CurY
                that.curX = cell.cellIndex; //attention pas de this
                that.curY = cell.parentNode.rowIndex;
                
                //mettre à jour la position curX et CurY
                that.playerTurn = false;
                that.enemy.playerTurn = true;


                //Verifier si joueur proche
                /*
               
                
                ============    Dans les lignes dessous tu dis : si la case dans laquelle je clique a un autre joueur alors on combat
                                Ce n'est pas ce qu'on te demande
                                Il faut vérifier les cases à côté avec qqch dans le genre
                                const closeCells = that.getCloseCells()
                                closeCells.forEach(cell=>{ 
                                    if( cell.classList.contains("warrior") ){
                                        that.startCombat()
                                    }
                                })
                                
                if (newCell.classList.contains("has-player")) {
                    that.startCombat();
                    return;
                }
                
                            Il ne faut pas qu'une case avec un joueur se trouve dans tes movableCells
                
                
                */
                
                // si joueur proche combat

                const closeCells = that.getCloseCells(that.curX, that.curY, map.nb, map.rows);
                closeCells.forEach(cell=>{ 
                    if( cell.classList.contains("has-player") ){
                        that.startCombat();
                    }
                })
            })
        })
    }

    moveFocusedPlayer(startCell, endCell, movableCells){
        if (!this.playerTurn) {
            return;
        }
        //Supprimer la classe moveCells
        startCell.classList.remove("moveCells");
        this.removeMovableCells(movableCells);

        //Vérifier pour une arme
        if (this.checkWeapon(endCell)) {
            this.switchWeapon(startCell, endCell);
        }

        //Nettoyer ancienne cellule
        startCell.classList.remove('has-player');
        startCell.removeChild(startCell.firstChild);

        //Déplacer le joueur dans la case                
        const playerElt = this.createPlayerElt();
        endCell.classList.add("has-player");
        endCell.appendChild(playerElt);
        
        //mettre à jour la position curX et CurY
        this.curX = endCell.cellIndex;
        this.curY = endCell.parentNode.rowIndex;
        
        //mettre à jour la position curX et CurY
        this.playerTurn = false;
        this.enemy.playerTurn = true;

        const closeCells = this.getCloseCells(this.curX, this.curY, this.game.map.nb, this.game.map.rows);
        closeCells.forEach(cell=>{ 
            if( cell.classList.contains("has-player")){
                this.startCombat();
            }
        })
    }

    moveFocusedCell(event, startCell, movableCells) {

        const start = document.activeElement;
        let startX = start.cellIndex;
	    let startY = start.parentNode.rowIndex;

        console.log(startX, startY);
        const key = event.key;
        let newX = startX;
        let newY = startY;
        const table = document.querySelector('table');

        console.log(key);
        if (this.playerTurn) {
            switch (key) {
                case "ArrowUp":
                    if(table.rows[startY - 1].cells[newX] && table.rows[startY - 1].cells[newX].classList.contains('moveCells')){
                    newY = startY - 1;
                    }
                    break;
                case "ArrowDown":
                    if(table.rows[startY + 1].cells[newX] && table.rows[startY + 1].cells[newX].classList.contains('moveCells')){
                    newY = startY + 1;
                    }
                    break;
                case "ArrowLeft":
                    if(table.rows[newY].cells[startX - 1] && table.rows[newY].cells[startX - 1].classList.contains('moveCells')){
                    newX = startX - 1;
                    }
                    break;
                case "ArrowRight":
                    if(table.rows[newY].cells[startX + 1] && table.rows[newY].cells[startX + 1].classList.contains('moveCells')){
                    newX = startX + 1;
                    }
                    break;
                case "Enter":
                    this.moveFocusedPlayer(startCell, table.rows[newY].cells[newX], movableCells);
                    break;
            }
            let newCell = table.rows[newY].cells[newX];
            newCell.focus();
        }
    }

    arrowMove(allCells, map) {

        const startCell = allCells.rows[this.curY].cells[this.curX];
        startCell.classList.add("moveCells");
        const movableCells = this.getMovableCells(this.curX, this.curY, map.nb, map.rows);
        this.showMovableCells(movableCells);
        startCell.focus();
        document.addEventListener("keydown", (e) => {
            e.preventDefault();
            this.moveFocusedCell(e, startCell, movableCells);
        });
    }

}