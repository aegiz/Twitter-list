'use strict';

angular.module('states', ['ui.router'])
.config(function ($urlRouterProvider, $stateProvider) {
	// if the path doesn't match any of the urls you configured
   	// otherwise will take care of routing the user to the specified url
   	$urlRouterProvider.otherwise('/');
   	
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
	   		currentUser: function (AuthService, $q) {
		        var deferred = $q.defer();
		        AuthService.login().then(function (user) {
		          if (user) {
		            deferred.resolve(user);
		          } else {
		          	console.log("ERROR bro");
		            //deferred.reject('user-not-logged-in');
		          }
		        });
		        return deferred.promise;
		    },
	   	}
    })
    .state('inapp.displayData', {
	   	url : '/twitterlist',
	   	views: { 
	        "table": {
	            templateUrl: 'directives/table.html', 
	            controller: 'TableCtrl'
	          },
	         "pagination": {
	            templateUrl: 'directives/pagination.html', 
	            controller: 'PaginationCtrl'
	         }
	    }
   });
});