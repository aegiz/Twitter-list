'use strict';
angular.module('twitterListApp')
.service('FiltersService', ['TableService', function(TableService) {
	this.filterList = function (value) {
		switch (value) {
			case "noFilter":
				TableService.updateTable("noFilter");
				break;
			case "withoutList":
				TableService.updateTable("withoutList");
				break;
			case "withMultiList":
				TableService.updateTable("withMultiList");
				break;
		}
	};
}]);
