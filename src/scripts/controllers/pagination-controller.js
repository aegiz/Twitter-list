'use strict';

angular.module('twitterListApp')
.controller('PaginationCtrl', ['$scope', 'PaginationService', function($scope, PaginationService) {

	$scope.range = function (start, end) {
		var ret = [];
		if (!end) {
			end = start;
			start = 0;
		}
		for (var i = start; i < end; i++) {
			ret.push(i);
		}
		return ret;
	};

	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			PaginationService.setNewPage($scope.currentPage-1);
		}
	};

	$scope.nextPage = function () {
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			PaginationService.setNewPage($scope.currentPage+1);
		}
	};

	// Click on 1-2-3 etc ...
	$scope.setPage = function () {
		PaginationService.setNewPage(this.n);
	};

}]);