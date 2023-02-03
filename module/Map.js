import { Weapon } from "./Weapon.js";

export class Map {
    constructor(nbColumns, nbRows){
        this.mapX = nbColumns;
        this.mapY = nbRows;
        this.table = $('table');
        this.maxGreyCells = (nbColumns * nbRows) / 5; // nombre d'obstacle max
    }

    // crée la map en fonction du nombre de lignes et de colonnes
    buildMap(){
        for(let i = 0; i < this.mapY; i++){
            $(`<tr id="row-${i}"></tr>`).appendTo(this.table);
            for(let j = 0; j < this.mapX; j++){
                $('<td class="enable allMap" tabindex=0></td>').appendTo(`#row-${i}`);
            }
        }
    }

    // désactive des cases aléatoirement sur la map
    disableCells(){
        const allCells = $('.enable');

        // on désactive les cases une par une
        for(let i = 0; i < this.maxGreyCells; i++){
            let randomIndex = Math.floor(Math.random() * allCells.length);
            // si la case est déja désactivée on choisi une autre case
            while($(allCells[randomIndex]).hasClass('disabled')){
                randomIndex = Math.floor(Math.random() * allCells.length);
            }
            // on désactive la case
            $(allCells[randomIndex]).addClass('disabled');
            $(allCells[randomIndex]).removeClass('enable');
        }
    }

    // initialise les armes
    initweapons(){

        //crée les armes
        const weapon1 = new Weapon("hache", 18, "axe.png");
        const weapon2 = new Weapon("masse", 12, "club.png");
        const weapon3 = new Weapon("épée", 15, "sword.png");
        const weapon4 = new Weapon("pistolet", 20, "gun.png");
        const weapon5 = new Weapon("couteau", 10, 'knife.png');

        // place les armes sur la map sauf couteau (arme par défaut du joueur)
        weapon1.placeWeapon();
        weapon2.placeWeapon();
        weapon3.placeWeapon();
        weapon4.placeWeapon();

        // renvoie un tableau contenant les armes
        const weapons = [weapon1, weapon2, weapon3, weapon4, weapon5];
        return weapons;
    }
}