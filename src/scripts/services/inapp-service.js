'use strict';
angular.module('twitterListApp')
	.factory('InappService', ['$q', function($q) {
		var listOfLists = [],
			users = [],
			scoreList = [],
			matrix = [],
			paginationDatas = [],
   			currentPage = 0,
			pagedItems = [];

		return {
			listOfLists: listOfLists,
			users: users,
			scoreList: scoreList,
			matrix: matrix,
			paginationDatas: paginationDatas,
			currentPage: currentPage,
			pagedItems: pagedItems,
		};
	}]);