'use strict';
angular.module('twitterListApp')
.service('FiltersService', ['InappService', 'SearchService', 'TableService', function(InappService, SearchService, TableService) {
	this.filter = function(value) {
		// Set correct tab
		InappService.filterInfos.currentTab = value;
		// Reset search
		SearchService.reset(true);
		// Update table value
		TableService.fillTable(value);
	};
}]);
