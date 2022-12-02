class Weapon{
    constructor(name, damage, imgSrc)
    {
        this.name = name;
        this.damage = damage;
        this.imgSrc = imgSrc;
    }

    createWeaponElt(){
        const weaponElt = document.createElement('span');
        weaponElt.classList.add('has-weapon');
        weaponElt.setAttribute("data-weapon", this.name);
        weaponElt.style.backgroundImage= `url(./src/${this.imgSrc})`;

        return weaponElt
    }

    placeWeapon(){
        const allCells = document.querySelectorAll('.enable');

        let randomIndex = Math.floor(Math.random() * allCells.length);
        let curCell = allCells[randomIndex];

        while(curCell.classList.contains('has-player')
        || curCell.classList.contains('has-weapon'))
        {
            randomIndex = Math.floor(Math.random() * allCells.length);
            curCell = allCells[randomIndex];
        }
        curCell.classList.add('has-weapon');
        curCell.appendChild(this.createWeaponElt());
    }
}