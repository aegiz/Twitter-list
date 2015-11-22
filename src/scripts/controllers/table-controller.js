'use strict';

angular.module('twitterListApp')
.controller('TableCtrl', ['$scope', 'TableService', 'PaginationService', '$timeout', function($scope, TableService, PaginationService, $timeout) {
	$scope.handleInputClick = function(infos) {
		infos.actionTodo = (infos.subscribed) ? "create" : "destroy";
		TableService.addAction(infos);
	};
}]);