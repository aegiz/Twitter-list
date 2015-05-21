// Prochain Obj : 
// - comprendre pourquoi les colonnes se réorganisent d'un seul coup à la fin

// Todo: 
// - utiliser les curseurs pour gérer la pagination
// - bug bouton logout
// - valider la souscription à une nouvelle listes


// ANGULAR :

var twitterListApp = angular.module("twitterListApp", ['ngRoute', 'templates'])

.config(function(HullServiceProvider) {
  HullServiceProvider.setHost("https://6e082fcc.hullapp.io");
  HullServiceProvider.setAppId("54db24c7e4bd981bee000281");
})

