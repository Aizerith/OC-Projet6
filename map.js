class Map {
    constructor(nbColones, nbLignes){
        this.mapX = nbColones;
        this.mapY = nbLignes;
        this.table = document.querySelector('table');
    }

    buildMap(){

        for(let i = 0; i < this.mapY; i++){
            const row = document.createElement('tr');
            this.table.appendChild(row);

            for(let j = 0; j < this.mapX; j++){
                let mapCell = document.createElement('td');
                mapCell.classList.add('enable', 'allMap');
                mapCell.setAttribute('tabindex', 0);
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
        const weapon5 = new Weapon("couteau", 10, 'knife.png');

        weapon1.placeWeapon();
        weapon2.placeWeapon();
        weapon3.placeWeapon();
        weapon4.placeWeapon();

        const weapons = [weapon1, weapon2, weapon3, weapon4, weapon5];
        return weapons;
    }
}