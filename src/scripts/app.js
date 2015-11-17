var twitterListApp = angular.module("twitterListApp", ['ngRoute', 'templates', 'states', 'angularViewportWatch'])

.config(function(HullServiceProvider) {
	HullServiceProvider.setHost("https://6e082fcc.hullapp.io");
	HullServiceProvider.setAppId("54db24c7e4bd981bee000281");
})

.constant("isMock", false) // by default false as we want to retrieve the data from Twitter API

.run(function ($rootScope, $state, $location) {
	$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
		console.log(error);
	});
})