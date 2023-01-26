export class Modal{
    constructor(parentElt){
        this.parentElt = parentElt;
    }

    // crée le contenu du modal de combat
    initFightModal(player){
        this.parentElt.innerHTML = `
        <div class="overlay modal-trigger"></div>
            <div class="modal">
                <h2>Combat!!!!</h2>
                <p>${player.name} attaque ${player.enemy.name}</p>
                <div id="message-display"></div>
                <form id="fight-mode-choice">
                    <input type="radio" name="fight-mode" value="attack">Attaquer
                    <input type="radio" name="fight-mode" value="defense">défendre<br>
                    <button id="confirm-choice">Valider</button>
                    <button style="display:none" id="replay">Rejouer</button>
                </form>
            </div>
        `
    }
    
    // affiche un message dans le modal
    displayMessage(message) {
        $('#message-display').text("");
        $('#message-display').append($("<p></p>").text(message));
        return null;
    }

    // affiche le message de fin de jeu
    endGameMessage(player){
        $('.modal').html(`
        <h2>Fin du combat!</h2>
        <p>Victoire de ${player}!!</p>
        <button id="replay">Rejouer</button>`);
    }
};