class Player {
    constructor(name, imgSrc){
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

    getCloseCells(x, y, mapX, mapY){

        const allCells = document.querySelector('table');
        console.log(allCells, x, y);
        const CloseCells = [];
        (y > 0) ? CloseCells.push(allCells.rows[y-1].cells[x]) : "";
        (y < mapY-1) ? CloseCells.push(allCells.rows[y+1].cells[x]) : "";
        (x > 0) ? CloseCells.push(allCells.rows[y].cells[x-1]) : "";
        (x < mapX-1) ? CloseCells.push(allCells.rows[y].cells[x+1]) : "";
        console.log("getclosecells:", CloseCells);
        return (CloseCells)
    }

    getMovableCells(x, y, mapX, mapY){
        const allCells = document.querySelector('table');
        const movableCells = [];
        let moveX = 1;
        let moveY = 1;
        for (let i = 0; i < 3; i++)
        {
            if (y - moveY >= 0 &&
                !allCells.rows[y-moveY].cells[x].classList.contains('disabled'))
            {
                movableCells.push(allCells.rows[y-moveY].cells[x])
                moveY++;
            }
        }
        moveY = 1;
        for (let i = 0; i < 3; i++)
        {
            if (y + moveY < mapY &&
                !allCells.rows[y+moveY].cells[x].classList.contains('disabled'))
            {
                movableCells.push(allCells.rows[y+moveY].cells[x])
                moveY++;
            }
        }
        for (let i = 0; i < 3; i++)
        {
            if (x - moveX >= 0 &&
                !allCells.rows[y].cells[x-moveX].classList.contains('disabled'))
            {
                movableCells.push(allCells.rows[y].cells[x-moveX])
                moveX++;
            }
        }
        moveX = 1;
        for (let i = 0; i < 3; i++)
        {
            if (x + moveX < mapX &&
                !allCells.rows[y].cells[x+moveX].classList.contains('disabled'))
            {
                movableCells.push(allCells.rows[y].cells[x+moveX])
                moveX++;
            }
        }
        console.log("movableCell:", x, y, movableCells);
        return movableCells;
    }

    showMovableCells(movableCells){
        movableCells.forEach(cell=>{
            cell.classList.add('moveCells');
        })
    }

    removeMovableCells(movableCells){
        movableCells.forEach(cell=>{
            cell.classList.remove('moveCells');
        })
    }

    checkWeapon(selectedCell){
        if (selectedCell.classList.contains('has-weapon'))
            return true;
        else
            return false;
    }

    getWeapon(newWeapon){
        let playerWeapon;
        this.game.weapons.forEach(weapon=>{
            if(weapon.name == newWeapon){
                console.log("arme trouvé", weapon);
                playerWeapon = weapon;
            }
        })
        return playerWeapon;
    }

    switchWeapon(startCell, endCell){

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

    startCombat(){
        console.log("COMBAT!!");
        if (this.hp <= 0 || this.enemy.hp <= 0){
            return;
        } 
        if(this.enemy.atkMode) {
            this.enemy.hp = this.enemy.hp - this.weapon.damage;
            this.hp = this.hp - this.enemy.weapon.damage;
        }
        else {
            this.enemy.hp = this.enemy.hp - (this.weapon.damage / 2);
        }
    }

    /*
    movePlayer(x, y, allCells)
    {
        allCells.rows[this.curY].cells[this.curX].classList.remove('has-player');
        allCells.rows[this.curY].cells[this.curX].removeChild(allCells.rows[this.curY].cells[this.curX].firstChild);    
        
        const playerElt = this.createPlayerElt();
        const newCell = allCells.rows[y].cells[x]; 
        
        if (newCell.classList.contains("has-player")){
                    this.startCombat();
        }
        if (this.checkWeapon(newCell)){
            this.switchWeapon(allCells.rows[this.curY].cells[this.curX], newCell);
        }

        newCell.classList.add("has-player");
        newCell.appendChild(playerElt);
        this.curX = x;
        this.curY = y;
    }
    */
   
    playerPlay(map, allCells)
    {
        if (!this.playerTurn){
            return
        }
        else {
            //this.movePlayer(allCells, map);
            this.arrowMove(allCells, map);
        }
        /*
        const movableCells = this.getMovableCells(this.curX, this.curY, map.nb, map.rows);
        this.showMovableCells(movableCells);
        const that = this;

        movableCells.forEach(cell=>{
            cell.addEventListener('click', function(e){
                e.preventDefault();
                console.log(this.cellIndex, this.parentNode.rowIndex);
                if(that.playerTurn){
                        that.movePlayer(this.cellIndex, this.parentNode.rowIndex, allCells, map);
                        that.playerTurn = false;
                        that.enemy.playerTurn = true;
                        that.removeMovableCells(movableCells);
                }
            });
        })*/
    }

    // vérifie s'il y a des joueurs à coté
    checkClosePlayer(x = this.curX, y = this.curY, mapX, mapY){
        const closeCells = this.getCloseCells(x, y, mapX, mapY);
        let hasWarrior = false;
        closeCells.forEach(el=>{
            if(el && el.classList.contains('has-player'))
            {
                console.log("test")
                hasWarrior = true;
            }
        })
        return hasWarrior
    }

    getRandNb(length){
        return Math.floor(Math.random() * length);
    }

    // créer l'élément joueur
    createPlayerElt()
    {
        const playerElt = document.createElement('span');
        playerElt.classList.add('has-player');
        playerElt.setAttribute("data-player", this.name);
        // playerElt.innerHTML= `<img src="./src/${this.imgSrc}">`
        playerElt.style.backgroundImage = `url(./src/${this.imgSrc})`;
        
        return playerElt;
    }

    // place le joueur sur la map après la création
    placePlayer(mapX, mapY){
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
        }
        else {
            this.placePlayer();
        }
    }

    getGame(game){
        this.game = game;
    }

    movePlayer(allCells, map) {
    //1 - récupérer les cases libres 
        const movableCells = this.getMovableCells(this.curX, this.curY, map.nb, map.rows);
        this.showMovableCells(movableCells);
        const that = this;

        movableCells.forEach(cell => {
        
        cell.addEventListener('click', function(e) {
            e.preventDefault();
            //1 - supprimer la classe moveCells
            if(!that.playerTurn){
                return;
            }
            that.removeMovableCells(movableCells);
            //2 Déplacer le joueur dans la case 
            
            const newCell = allCells.rows[this.parentNode.rowIndex].cells[this.cellIndex];

            if (newCell.classList.contains("has-player")) {
                that.startCombat();
                return;
            }

            allCells.rows[that.curY].cells[that.curX].classList.remove('has-player');
            allCells.rows[that.curY].cells[that.curX].removeChild(allCells.rows[that.curY].cells[that.curX].firstChild);

            if (that.checkWeapon(newCell)) {
                that.switchWeapon(allCells.rows[that.curY].cells[that.curX], newCell);
            }
            const playerElt = that.createPlayerElt();
            newCell.classList.add("has-player");
            newCell.appendChild(playerElt);
            that.curX = this.cellIndex;
            that.curY = this.parentNode.rowIndex;
            that.playerTurn = false;
            that.enemy.playerTurn = true;
        })
    })
  }

  moveFocusedPlayer(event) {
    const start = document.activeElement;
	let startX = start.cellIndex;
	let startY = start.parentNode.rowIndex;

	const key = event.key;
	let newX = startX;
	let newY = startY;
  
  console.log(key);
    if (this.playerTurn){
	switch(key){
		case "ArrowUp" :
    	newY = startY - 1;
    	break;
    case "ArrowDown" :
    	newY = startY + 1;
    	break;
    case "ArrowLeft" :
    	newX = startX - 1;
    	break;
    case "ArrowRight" :
    	newX = startX + 1;
    	break;
    case "Enter" :
        this.playerTurn = false;
        this.enemy.playerTurn = true;
        break;
    }
    const table = document.querySelector('table');
    let newCell = table.rows[newY].cells[newX];
    newCell.focus();
    }
  }

  arrowMove(allCells, map){
    const startCell = allCells.rows[this.curY].cells[this.curX];
    const movableCells = this.getMovableCells(this.curX, this.curY, map.nb, map.rows);
    this.showMovableCells(movableCells);
    startCell.focus();
    document.addEventListener("keydown", (e) => {
        e.preventDefault();
        this.moveFocusedPlayer(e);
    });
  }


//  playerPlay(map, allCells) {
  	// 1 Vérifier si c'est ton tour
    /*
    Si false : return;
    */
    
    //2 si ya combattant a cote se battre sinon se deplacer
    /*
    Si combattant : Combattre 
    Sinon : movePlayer    
    
    */
    
    //3 reinitilaise les tours
  //}

}