'use strict';

angular.module('twitterListApp')
   .controller('InappCtrl', ['$rootScope', 'AuthService', 'TableService', '$state', 'currentUser', function($rootScope, AuthService, TableService, $state, currentUser) {
      $rootScope.currentUser = currentUser;

      TableService.initializeTableWithDatas(10, false);

        $rootScope.$watch(function () {
        	return TableService.tableDatas;
	    }, function(newVal, oldVal) {
	    	if(newVal !== oldVal) {
	        	$rootScope.listOfLists = newVal.listOfLists;
	        	$rootScope.user = newVal.users;
	        	$rootScope.matrix = newVal.matrix;
	        }
	   }, true);

      $rootScope.logout = function () {
        AuthService.logout().then(function () { // fonction logout a créer
          $rootScope.currentUser = null;
          $state.go('root');
        });
      };

   }]);