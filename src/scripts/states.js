'use strict';

angular.module('states', ['ui.router'])
.config(function ($urlRouterProvider, $stateProvider) {
	// if the path doesn't match any of the urls
	$urlRouterProvider
	.otherwise('/');
	
	$stateProvider
	.state('root', {
		url : '/',
		templateUrl: 'directives/login.html',
		controller: 'LoginCtrl',
	})
	.state('inapp', {
		abstract: true,
		templateUrl: 'inapp.html',
		controller: 'InappCtrl',
		resolve: {
			loginUser: function ($state, $location, $rootScope, AuthService, TableService) {
				if($state.current.name !== "root") { // Prevent user to start if he was not on login page
					$location.path('/');
				} else {
					AuthService.login().then(function (user) {
						if (user) {
							$rootScope.currentUser = user;
							// Launch table initialization
							TableService.initializeTableWithDatas();
						} else {
							$location.path('/');
						}
					});
				}
			}
		}
	})
	.state('inapp.loadData', {
		url : '/',
		views: {
			'loader': {
				templateUrl: 'inapp.loader.html',
			}
		}
	})
	.state('inapp.displayData', {
		url : '/dashboard',
		views: { 
			"table": {
				templateUrl: 'directives/table.html', 
				controller: 'TableCtrl'
			},
			"pagination": {
				templateUrl: 'directives/pagination.html', 
				controller: 'PaginationCtrl'
			},
			"searchBar": {
				templateUrl: 'directives/search.html', 
				controller: 'SearchCtrl'
			},
			"filters": {
				templateUrl: 'directives/filters.html', 
				controller: 'FiltersCtrl'
			}
		}
	});
});