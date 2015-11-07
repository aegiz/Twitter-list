'use strict';

angular.module('twitterListApp')
.controller('InappCtrl', ['$scope', 'InappService', '$state', function($scope, InappService, $state) {
	
	// Watch of all the variables

	/*
	* listOfLists: 
	* This array hold all the infos relative to the lists created by the connected user
	* Structure: listOfLists = [Object, Object, ...] where Object is a single list.
	* A single list has these properties: {id: ,name:, user: Array }. 
	* ... Where users is an array of users contains in the list
	
	* Obj: listOfLists is handy when we have to calculate the score of a following (step performed during init and validation)
	*/

	$scope.$watch(function () {
		return InappService.listOfLists;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.listOfLists = newVal;
		}
	}, true);

	/*
	* users: 
	* A collection of all the people our connected user follow. 
	* Structure: users = [Object, Object, ...] 

	* Obj: users' object help to build the matrix (step performed during init and reset of user after some clicks on the filtering)
	*/

	$scope.$watch(function () {
		return InappService.users;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.users = newVal;
		}
	}, true);

	
	/*
	* matrix: 
	* This Array is a copy of users' object. The difference is that in each user there is an associated belongsToList object. 
	* in belongsToList we list if the current person belong to the list or not.

	* Obj: matrix is used to build a new object pagedItems
	*/

	$scope.$watch(function () {
		return InappService.matrix;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.matrix = newVal;
		}
	}, true);

	/*
	* pagedItems: 
	* This Array is build construite from matrix decomposition in sub-pages

	* Obj: pagedItems is specially dedicated to display the informations on the screen
	*/

	$scope.$watch(function () {
		return InappService.pagedItems;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.pagedItems = newVal;
		}
	}, true);

	/*
	* currentPage: 
	* this int is dedicated to page's navigation (technically it's the index of pagedItems)
	* So when it's value change the able view is updated
	*/

	$scope.$watch(function () {
		return InappService.currentPage;
	}, function(newVal, oldVal) {
		$scope.currentPage = newVal;
	}, true);

}]);