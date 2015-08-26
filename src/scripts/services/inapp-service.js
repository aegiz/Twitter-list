'use strict';
angular.module('twitterListApp')
	.factory('InappService', ['$q', function($q) {
		var listOfLists = [],
			users = [],
			scoreList = [],
			matrix = [],
   			currentPage = 0,
			pagedItems = [];

		return {
			listOfLists: listOfLists,
			users: users,
			scoreList: scoreList,
			matrix: matrix,
			currentPage: currentPage,
			pagedItems: pagedItems,
		};
	}]);