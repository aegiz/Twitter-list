'use strict';

angular.module('twitterListApp')
.controller('TableCtrl', ['$scope', '$timeout' ,'TableService', 'PaginationService', function($scope, $timeout, TableService, PaginationService) {
	$scope.handleInputClick = function(infos, $event) {
		infos.actionTodo = (infos.subscribed) ? "create" : "destroy";
		TableService.addAction(infos);
		var currentTarget = $($event.currentTarget);
		currentTarget.attr("disabled", true);
		currentTarget.parent().addClass("clicked");
		$timeout(function() {
			currentTarget.attr("disabled", false);
			currentTarget.parent().removeClass("clicked");
		}, 2500);
	};
}]);