// Prochain Obj : 

// TODO & Features (non priorétisés)


// Mettre un loading de chargement quand récupération des données
// Bug quand l'utilisateur clic sur le bouton mais ne se log pas dans la popup
// Au scroll faire aussi descendre l'axe des abscisses pour pouvoir continuer à suivre les listes
// Au clic sur une rangée : afficher (dans une popup?) plus d'informations sur l'utilisateur.
// Pouvoir nottamment unfollow un utilisateur et le supprimer par la même occasion des listes dans lesquelles il était.
// Au clic sur un nouveau bouton pouvoir afficher uniquement les utilisateurs n'ayant pas encore été classé dans des listes
// Implémentation des boutons suivant / précédent permettant d'accéder à la suite de la liste
// Prévoir le fait que l'utilisateur ait 40 listes
// Prévoir le fait que l'utilisateur ait 0 liste

// ANGULAR :

var twitterListApp = angular.module("twitterListApp", ['ngRoute', 'templates'])

.config(function(HullServiceProvider) {
  	HullServiceProvider.setHost("https://6e082fcc.hullapp.io");
  	HullServiceProvider.setAppId("54db24c7e4bd981bee000281");
})

