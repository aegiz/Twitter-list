'use strict';

angular.module('twitterListApp')
.controller('FiltersCtrl', ['$scope', 'FiltersService', function($scope, FiltersService) {
	
	$scope.checkWithoutList = false;
	$scope.checkWithMultipleLists = false;
	
	$scope.filterWithoutList = function (checked) {
		FiltersService.filterWithoutList(checked);
	};

	$scope.filterWithMultipleLists = function (checked) {
		FiltersService.filterWithMultipleLists(checked);
	};
}]);