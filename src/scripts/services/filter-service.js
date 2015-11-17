'use strict';
angular.module('twitterListApp')
.service('FiltersService', ['TableService', function(TableService) {
	this.filterList = function (value) {
		switch (value) {
			case "noFilter":
				TableService.filterTable("noFilter");
				break;
			case "withoutList":
				TableService.filterTable("withoutList");
				break;
			case "withMultiList":
				TableService.filterTable("withMultiList");
				break;
		}
	};
}]);
