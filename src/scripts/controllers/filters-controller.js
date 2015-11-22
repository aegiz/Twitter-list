'use strict';

angular.module('twitterListApp')
.controller('FiltersCtrl', ['$scope', 'InappService', 'TableService', function($scope, InappService, TableService) {
	$scope.filterList = function (value) {
		InappService.selectedTab.currentTab = value;
		TableService.updateTable(value);
	};
}]);