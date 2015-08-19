/* Lien ver la doc : 

https://docs.google.com/document/d/1TBk5tUSIVYM1dcukVYTBt83LoD2CW_kOJKBGHwTjXTA/edit?usp=sharing

*/

// TODO & Features (non priorétisés)

/*
*  Au scroll faire aussi descendre l'axe des abscisses pour pouvoir continuer à suivre les listes
*  Au clic sur une rangée : afficher (dans une popup?) plus d'informations sur l'utilisateur.
*  Pouvoir nottamment unfollow un utilisateur et le supprimer par la même occasion des listes dans lesquelles il était.
*  Au clic sur un nouveau bouton pouvoir afficher uniquement les utilisateurs n'ayant pas encore été classé dans des listes
*  Prévoir le fait que l'utilisateur ait 40 listes
*  Prévoir le fait que l'utilisateur ait 0 liste
*  Bug connu : une fois la tâche subscribeUsers done, updater $scope.matrix sinon les users qui n'avaient pas de listes initialement apparaissent quand même alors que l'on vient de les subscribe
*  Mobile ?

// TODO & Features (priorétisés)


* 1 - exterioriser le nombre d'item par page pour donner la main à l'utilisateur sur ce nombre
* 2 - Chainer les calls aux user / Sauf quand plus de 1700 following
* 3 - utiliser la méthode getTwitterInfos.get('/users/lookup?user_id=' + item.id) pour en savoir plus sur un user
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