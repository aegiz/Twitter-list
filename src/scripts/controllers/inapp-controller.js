'use strict';
// Role of this controller: Expose these variables in the parent scope to allow the children to access them

angular.module('twitterListApp')
.controller('InappCtrl', ['$scope', 'InappService', '$state', function($scope, InappService, $state) {
	$scope.$watch(function () {
		return InappService.listOfLists;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.listOfLists = newVal;
		}
	}, true);

	$scope.$watch(function () {
		return InappService.pagedItems;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.pagedItems = newVal;
		}
	}, true);

	$scope.$watch(function () {
		return InappService.currentPage;
	}, function(newVal, oldVal) {
		$scope.currentPage = newVal;
	}, true);

	$scope.$watch(function () {
		return InappService.filterInfos;
	}, function(newVal, oldVal) {
		$scope.filterInfos = newVal;
	}, true);


	$scope.$watch(function () {
		return InappService.clearSearch;
	}, function(newVal, oldVal) {
		$scope.clearSearch = newVal;
	}, true);

}]);