'use strict';

angular.module('twitterListApp')
.controller('FiltersCtrl', ['$scope', 'FiltersService', function($scope, FiltersService) {
	$scope.selectedTab = "noFilter";
	$scope.filterList = function (value) {
		$scope.selectedTab = value;
		FiltersService.filterList(value);
	};
}]);