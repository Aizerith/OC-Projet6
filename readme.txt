Il faut lancer le programme sur un serveur local
par exemple avec Live Serveur sur VSCode
----------------------------------------------------------------------------------------------
PARAMETRE DE JEU

- changer la taille de la map
  main.js > ligne 15 > on remplace les valeur dans map(x, y)

- changer le nom des joueurs
  main.js > ligne 20 > on remplace les noms dans Game(gameMap, "joueur1", "joueur2");

- parfois les obstacles générés font que les joueurs ne pourront pas se croiser
  dans ce cas la il faudra actualiser la page pour générer une autre map

- il faut cliquer le le bouton start pour lancer le jeu

----------------------------------------------------------------------------------------------
DEPLACEMENT

- on se déplace case par case avec les flèches du clavier jusqu'à 3 cases
- on ne peut pas traverser les obstacles (case orange marron)
- on termine son tour lorsqu'on à bougé de 3 cases ou lorsqu'on appuie sur la touche 'ENTRER'
- si on entre dans une case avec une arme, on ramasse l'arme en laissant l'ancienne arme
  sur la case de départ
- si on entre dans une case adjacente à l'adversaire le combat se lance

----------------------------------------------------------------------------------------------
COMBAT

choisir entre attaquer ou défendre
attaquer inflige les dommages de notre arme
défendre divise par 2 les dommage reçu par la prochaine attaque
le combat se termine lorque un des 2 joueurs arrive a 0 pv.

cliquer sur le bouton rejouer pour relancer la partie

