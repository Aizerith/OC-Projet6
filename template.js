class Panel{
    constructor(parentElt, player){
        this.parentElt = parentElt;
        this.player = player;
    }

    displayPlayer(){
        this.parentElt.innerHTML = `
        <div class="info-joueur">
            <h2>${this.player.name}</h2>
            <dl>
                <dt>Points de vie : ${this.player.hp}</dt>
                <dt>Arme : ${this.player.weapon.name}</dt>
                <dt>Dommage :${this.player.weapon.damage}</dt>
                <dt>Position x :${this.player.curX}</dt>
                <dt>Position y :${this.player.curY}</dt>
            </dl>
        </div>`
    }

    refreshPanel(){
        this.displayPlayer();
    }
}