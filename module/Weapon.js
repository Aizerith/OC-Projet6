export class Weapon{
    constructor(name, damage, imgSrc)
    {
        this.name = name;
        this.damage = damage;
        this.imgSrc = imgSrc;
    }

    // donne un chiffre aléatoire 
    getRandNb(length) {
        return Math.floor(Math.random() * length);
    }

    // crée les armes
    createWeaponElt(){
        const weaponElt = document.createElement('span');
        weaponElt.classList.add('has-weapon');
        weaponElt.setAttribute("data-weapon", this.name);
        weaponElt.style.backgroundImage= `url(./images/${this.imgSrc})`;

        return weaponElt;
    }

    // place les armes sur la map
    placeWeapon(){
        const allCells = document.querySelectorAll('.enable');

        // defini une case de la map au hasard
        let randomIndex = this.getRandNb(allCells.length);
        let curCell = allCells[randomIndex];

        // tant qu'il y a une arme ou un joueur sur la case, on defini une nouvelle case
        while(curCell.classList.contains('has-player')
        || curCell.classList.contains('has-weapon'))
        {
            randomIndex = this.getRandNb(allCells.length);
            curCell = allCells[randomIndex];
        }

        // ajoute l'arme sur la case
        curCell.classList.add('has-weapon');
        curCell.appendChild(this.createWeaponElt());
    }
}