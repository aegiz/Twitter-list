'use strict';
angular.module('twitterListApp')
.service('SearchService', ['InappService', 'PaginationService', '$filter', function(InappService, PaginationService, $filter) {
	var filteredItems = [],
		searchMatch = function (haystack, needle) {
			if (!needle) {
				return true;
			}
			return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
		};
	this.search = function (query) {
		var matrix = [];
		switch (InappService.filterInfos.currentTab) {
			case "noFilter": 
				matrix = InappService.matrix;
				break;
			case "withoutList":
				matrix = InappService.matrixWithoutList;
				break;
			case "withMultiList":
				matrix = InappService.matrixWithMultiList;
				break;
			default: 
				console.log("Error concerning matrix");
		}
		filteredItems = $filter('filter')(matrix, function (item) {
			if (searchMatch(item.name, query)) {
				return true;
			}
			return false;
		});
		PaginationService.groupToPages(filteredItems);
	};
	this.reset = function (value) {
		InappService.clearSearch = value;
	};
}]);
