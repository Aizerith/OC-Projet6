class Modal{
    constructor(parentElt){
        this.parentElt = parentElt;
    }

    initFightModal(player){
        this.parentElt.innerHTML = `
        <div class="overlay modal-trigger"></div>
            <div class="modal">
                <h2>Combat!!!!</h2>
                <p>${player.name} attaque ${player.enemy.name}</p>
                <div id="message-display"></div>
                <form id="fight-mode-choice">
                    <input type="radio" name="fight-mode" value="attack">Attaquer
                    <input type="radio" name="fight-mode" value="defense">défendre
                    <button id="confirm-choice">Valider</button>
                    <button style="display:none" id="replay">Rejouer</button>
                </form>
            </div>
        `
    }
    
    displayMessage(message) {
        const displayElt = document.getElementById("message-display");
        displayElt.innerHTML = "";
        let elt = document.createElement('p');
        elt.textContent = message;
        displayElt.appendChild(elt);
        return null;
    }

    endGameMessage(){
        const displayElt = document.querySelector(".modal");

        displayElt.innerHTML =`
                <h2>Fin du combat!</h2>
                <button id="replay">Rejouer</button>
            </div>
        `
    }
}