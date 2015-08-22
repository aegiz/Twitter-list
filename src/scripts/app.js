/* Lien ver la doc : 

https://docs.google.com/document/d/1TBk5tUSIVYM1dcukVYTBt83LoD2CW_kOJKBGHwTjXTA/edit?usp=sharing

*/

// TODO & Features

/*
*  Faire un petit calcul pour savoir combien d'utilisateurs afficher par page
*  Cleaner les données inutiles récupérer par Twitter sur les différentes variables
*  Commenter le nom de chaque variable
*  Désactiver les filters s'il y a des cell to update

*  Gérer le cas où la personne a plus de 2800 followings
*  Au scroll faire aussi descendre l'axe des abscisses pour pouvoir continuer à suivre les listes
*  Au clic sur une rangée : afficher (dans une popup?) plus d'informations sur l'utilisateur.
*  Pouvoir nottamment unfollow un utilisateur et le supprimer par la même occasion des listes dans lesquelles il était.
*  Prévoir le fait que l'utilisateur ait 40 listes
*  Prévoir le fait que l'utilisateur ait 0 liste
*  Mobile ?
*  Popup de confirmation si l'utilisateur quitte et il a des changements non enregistrés
*  Bug avec un cursor undefined et des calls à la chaine.... (en clair il faut un moyen de vérifier que l'on a reach le rate limit)
*  Utiliser la méthode getTwitterInfos.get('/users/lookup?user_id=' + item.id) pour en savoir plus sur un user
*/

var twitterListApp = angular.module("twitterListApp", ['ngRoute', 'templates', 'states'])

.config(function(HullServiceProvider) {
	HullServiceProvider.setHost("https://6e082fcc.hullapp.io");
	HullServiceProvider.setAppId("54db24c7e4bd981bee000281");
})

.run(function ($rootScope, $state, $location) {
	$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
		console.log(error);
	});
})