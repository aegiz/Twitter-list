'use strict';
// Credits & idea http://stackoverflow.com/questions/10816073/how-to-do-paging-in-angularjs/12670473#12670473
angular.module('twitterListApp')
.service('PaginationService', ['getTwitterInfos', 'InappService', '$filter', function(getTwitterInfos, InappService, $filter) {
	
	var itemsPerPage = 50;

	/*
	* initialize the number of user to see in the viewport
	* @param {Object} filteredItems.
	*/

	this.initializeUserNb = function(followings) {
		switch(followings) {
			case followings < 800:
				itemsPerPage = 50;
				break;
			case followings < 1120:
				itemsPerPage = 70;
				break;
			case followings < 1600:
				itemsPerPage = 100;
				break;
			case followings < 2800:
				itemsPerPage = 175;
				break;
			 default:
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
		InappService.currentPage = 0;
		InappService.pagedItems = pagedItems;
	};

	this.setNewPage = function(newValue) {
		InappService.currentPage = newValue;
	};
}]);
