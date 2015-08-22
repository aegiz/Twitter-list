'use strict';

angular.module('twitterListApp')
.controller('InappCtrl', ['$scope', 'InappService', '$state', function($scope, InappService, $state) {
	
	// Watch all the variables

	/*
	* listOfLists: 
	* Cette array contient toutes les listes de notre utilisateur.
	* A compléter ...
	*/

	$scope.$watch(function () {
		return InappService.listOfLists;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.listOfLists = newVal;
		}
	}, true);

	$scope.$watch(function () {
		return InappService.users;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.users = newVal;
		}
	}, true);

	$scope.$watch(function () {
		return InappService.scoreList;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.scoreList = newVal;
		}
	}, true);

	$scope.$watch(function () {
		return InappService.matrix;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.matrix = newVal;
		}
	}, true);

	$scope.$watch(function () {
		return InappService.paginationDatas;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.paginationDatas = newVal;
		}
	}, true);

	$scope.$watch(function () {
		return InappService.currentPage;
	}, function(newVal, oldVal) {
		$scope.currentPage = newVal;
	}, true);

	$scope.$watch(function () {
		return InappService.pagedItems;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.pagedItems = newVal;
		}
	}, true);

	// fonction logout a créer

	$scope.logout = function () { 
		AuthService.logout().then(function () { 
			$scope.currentUser = null;
			$state.go('root');
		});
	};
}]);