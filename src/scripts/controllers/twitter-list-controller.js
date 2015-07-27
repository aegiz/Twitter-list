/* 'use strict';

angular.module('twitterListApp')
   .controller('TwitterListCtrl', ['TableService', function(TableService) {
        debugger;
        TableService.initializeTableWithDatas(10, false);

        $scope.$watch(function () {
        	return TableService.tableDatas;
	    }, function(newVal, oldVal) {
	    	if(newVal !== oldVal) {
	        	$scope.listOfLists = newVal.listOfLists;
	        	$scope.user = newVal.users;
	        	$scope.matrix = newVal.matrix;
	        }
	   }, true);
   }]);


*/