'use strict';

angular.module('twitterListApp')
.controller('InappCtrl', ['$scope', 'InappService', '$state', function($scope, InappService, $state) {
	
	// Watch all the variables

	/*
	* listOfLists: 
	* Cette array contient toutes les infos relatives aux listes créées par notre user
	* Au niveau de sa structure listOfLists = [Object, Object, ...] chaque Object representant ici une liste créée.
	* Au sein d'une liste on trouve les propriétés suivantes : {id: ,name:, user: Array }. 
	* La propriété users est elle aussi une array contenant tous les users présents dans cette liste au moment de l'initialisation de l'application
	* 
	* Le role de listOfLists est d'aider au calcul du score d'un utilisateur (lors de l'initialisation et de la validation)
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
	* Cette array contient une collection des followings de notre utilisateur. users = [Object, Object, ...]
	* Le role de users est de pouvoir repertorier tous les users afin de construire $scope.matrix + d'établir la scorelist
	*/

	$scope.$watch(function () {
		return InappService.users;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.users = newVal;
		}
	}, true);

	/*
	* scoreList: 
	* Cette array contient une copie de users à la différence près que chaque user a maintenant un score propre en fonction du nombre de liste dans lequel il se trouve
	* Le role de scoreList est de pouvoir récupérer facilement une liste d'utilisateur ayant 0 ou plus de deux listes lors du clic sur les deux input de filtres
	*/

	$scope.$watch(function () {
		return InappService.scoreList;
	}, function(newVal, oldVal) {
		if(newVal !== oldVal) {
			$scope.scoreList = newVal;
		}
	}, true);

	/*
	* matrix: 
	* Cette array contient une copie de users à la différence près que chaque user a maintenant un objet belongsToList associé. Dans cet objet on précise si oui ou non le user appartient à la liste correspondante
	* Le role de matrix est de pouvoir être utilisé pour construire un nouvel objet pagedItems qui lui sera utilisé pour l'affichage
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
	* Cette array est construite à partir de la décomposition de matrix en sous page
	* La vue du tableau 
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
	* un int qui nous permets de naviguer entre les différente valeur de pagedItems 
	*/

	$scope.$watch(function () {
		return InappService.currentPage;
	}, function(newVal, oldVal) {
		$scope.currentPage = newVal;
	}, true);

}]);