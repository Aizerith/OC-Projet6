class Map {
    constructor(table, nbColones, nbLignes){
        this.nb = nbColones;
        this.rows = nbLignes;
        this.table = document.querySelector(table);
    }

    buildMap(){

        for(let i = 0; i < this.rows; i++){
            const row = document.createElement('tr');
            this.table.appendChild(row);

            for(let j = 0; j < this.nb; j++){
                let mapCell = document.createElement('td');
                mapCell.classList.add('enable', 'allMap');
                row.appendChild(mapCell);
            }
        }
    }

    disableCells(){
        const allCells = document.querySelectorAll('.enable');
        const maxGreyCells = allCells.length / 5;

        for(let i = 0; i < maxGreyCells; i++){
            let randomIndex = Math.floor(Math.random() * allCells.length);
            while(allCells[randomIndex].classList.contains('disabled')){
                randomIndex = Math.floor(Math.random() * allCells.length);
            }
            allCells[randomIndex].classList.add('disabled');
            allCells[randomIndex].classList.remove('enable');
        }
    }

    initweapons(){
        const weapon1 = new Weapon("hache", 18, "axe.png");
        const weapon2 = new Weapon("masse", 12, "club.png");
        const weapon3 = new Weapon("épée", 15, "sword.png");
        const weapon4 = new Weapon("pistolet", 20, "gun.png");

        weapon1.placeWeapon();
        weapon2.placeWeapon();
        weapon3.placeWeapon();
        weapon4.placeWeapon();

        const weapons = [weapon1, weapon2, weapon3, weapon4];
        console.log(weapons[0]);
        return weapons;
    }
}
/*
const gameMap = new Map('#map-container', 6, 5);
const player1 = new Player("Jean", "p1.png");
const panel1 = new Panel(document.getElementById('displayPlayer'), player1);
const player2 = new Player("Luke", "p2.png");
const panel2 = new Panel(document.getElementById('displayPlayer'), player2);

gameMap.buildMap();
gameMap.disableCells();
player1.placePlayer();
panel1.displayPlayer();
player2.placePlayer();
panel2.displayPlayer();
gameMap.initweapons();

*/