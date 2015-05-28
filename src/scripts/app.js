// Prochain Obj : 

// Todo: 

// - réimplémenter les appels à l'API twitter pour mieux gérer le ratelimit
// - utiliser les curseurs pour gérer la pagination
// - bug bouton logout

// Nouvelle stratégie
// 1- Call pour récupérer toutes les listes de l'utilisateur
// 2- Call pour récupérer les 100 derniers following
// 3- Pour chaque liste de l'utilisateur call pour en récupérer tous les membres.
// 4- Comparer

// ANGULAR :

var twitterListApp = angular.module("twitterListApp", ['ngRoute', 'templates'])

.config(function(HullServiceProvider) {
  HullServiceProvider.setHost("https://6e082fcc.hullapp.io");
  HullServiceProvider.setAppId("54db24c7e4bd981bee000281");
})

