class Player {
    constructor(name, imgSrc, playerTurn){
        this.name = name;
        this.hp = 100;
        this.weapon = new Weapon("couteau", 10, 'knife.png');
        this.imgSrc = imgSrc;
        this.game;
        this.enemy;
        this.playerTurn = playerTurn;
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

    unshowMovableCells(movableCells){
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

    getWeapon(selectedCell){
        this.game.weapons.forEach(weapon=>{
            if(weapon.name == selectedCell.value){
                return weapon;
            }
        })
    }

    switchWeapon(startCell, EndCell){
        startCell.classList.add('has-weapon');
        startCell.appendChild(this.weapon.createWeaponElt());
        console.log("endcell:", EndCell);
        this.weapon = this.getWeapon(EndCell);
        EndCell.classList.remove('has-weapon');
        EndCell.removeChild(EndCell.firstChild);
        this.panel.refreshPanel();
    }

    movePlayer(x, y, allCells, movableCells)
    {
       /* movableCells.forEach(cell=>{
            cell.addEventListener('click', function(e){
                e.preventDefault();
                console.log(this.cellIndex, this.parentNode.rowIndex);*/
                allCells.rows[this.curY].cells[this.curX].classList.remove('has-player');
                allCells.rows[this.curY].cells[this.curX].removeChild(allCells.rows[this.curY].cells[this.curX].firstChild);
                    
                const playerElt = this.createPlayerElt();
                allCells.rows[y].cells[x].classList.add('has-player');
                allCells.rows[y].cells[x].appendChild(playerElt);
                if (this.checkWeapon(allCells.rows[y].cells[x])){
                    this.switchWeapon(allCells.rows[this.curY].cells[this.curX], allCells.rows[y].cells[x]);
                }
                this.curX = x;
                this.curY = y;
                
                // remove movable cells
                /*});
            })
       */
        //regarder si il y a une arme
        //regarder si ya un combattant a coté
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

/*
   placePlayer(){
        // 1 recupérer les cases
    const allCells = document.querySelectorAll('.allMap');
    let selectedCell = allCells[Math.floor(Math.random() * allCells.length)];
    let x = selectedCell.cellIndex;
    let y = selectedCell.parentNode.rowIndex;

        let boucle = 1;

        console.log(allCells.length);
        console.log(selectedCell, x, y);
        console.log(this.checkClosePlayer(x, y));
        while(selectedCell.classList.contains('disabled')
              || selectedCell.classList.contains('has-player')
              || this.checkClosePlayer(x, y))
        {
            selectedCell = allCells[Math.floor(Math.random() * allCells.length)];
            x = selectedCell.parentNode.cellIndex;
            y = selectedCell.parentNode.rowIndex;

            console.log("boucle :", boucle);
            console.log(selectedCell, x, y);
            console.log(this.checkClosePlayer());
            console.log(this.getCloseCells(x, y));
            boucle = boucle + 1;
        }
        selectedCell.classList.add('has-player');
        selectedCell.setAttribute("value", this.name);
    }*/

    // créer l'élément joueur
    createPlayerElt()
    {
        const playerElt = document.createElement('span');
        playerElt.classList.add('has-player');
        playerElt.setAttribute("value", this.name);
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

}