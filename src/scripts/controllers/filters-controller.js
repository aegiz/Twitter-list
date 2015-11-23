'use strict';

angular.module('twitterListApp')
.controller('FiltersCtrl', ['FiltersService', '$scope', function(FiltersService, $scope) {
	$scope.filterList = function (value) {
		FiltersService.filter(value);
	};
}]);