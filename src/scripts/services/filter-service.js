'use strict';
angular.module('twitterListApp')
.service('FiltersService', ['TableService', function(TableService) {
	this.filterWithoutList = function (checked) {
		if(checked) {
			TableService.filterTable("withoutList");
		} else {
			TableService.filterTable("noFilter");
		}
	};
	this.filterWithMultipleLists = function (checked) {
		if(checked) {
			TableService.filterTable("withMultipleLists");
		} else {
			TableService.filterTable("noFilter");
		}
	};
}]);
