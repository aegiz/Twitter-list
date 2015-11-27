'use strict';
// Credits & idea http://stackoverflow.com/questions/10816073/how-to-do-paging-in-angularjs/12670473#12670473
angular.module('twitterListApp')
.service('PaginationService', ['getTwitterInfos', 'InappService', '$filter', function(getTwitterInfos, InappService, $filter) {
	
	var itemsPerPage = 0;

	/*
	* initialize the number of user to see in the viewport
	* @param {Object} filteredItems.
	*/

	this.initializeUserNb = function(followings) {
		if(followings < 50) {
			itemsPerPage = 30;
		} else if(followings < 200) {
			itemsPerPage = 40;
		} else if(followings < 800) {
			itemsPerPage = 50;
		} else if(followings < 1120) {
			itemsPerPage = 70;
		} else if(followings < 1600) {
			itemsPerPage = 100;
		} else if(followings <= 2800) {
			itemsPerPage = 175;
		} else {
			itemsPerPage = 200;
		}
	};

	/*
	* Split the matrix (or filtered matrix items) into pages
	* @param {Object} filteredItems.
	*/

	this.groupToPages = function (filteredItems) {
		var pagedItems = [];
		for (var i = 0; i < filteredItems.length; i++) {
			if (i % itemsPerPage === 0) {
				pagedItems[Math.floor(i / itemsPerPage)] = [ filteredItems[i] ];
			} else {
				pagedItems[Math.floor(i / itemsPerPage)].push(filteredItems[i]);
			}
		}
		InappService.pagedItems = pagedItems;
	};

	this.setNewPage = function(newValue) {
		InappService.currentPage = newValue;
	};
}]);
