'use strict';

angular.module('twitterListApp')
.controller('SearchCtrl', ['$scope', 'SearchService', function($scope, SearchService) {
	$scope.$parent.$watch('clearSearch', function(value) {
		if(value) {
			$scope.query = "";
			SearchService.reset(false);
		}
	});
	$scope.search = function () {
		SearchService.search($scope.matrix, $scope.query);
	};
}]);