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