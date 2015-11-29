'use strict';

angular.module('twitterListApp')
.controller('TableCtrl', ['$scope', '$timeout' ,'TableService', 'PaginationService', function($scope, $timeout, TableService, PaginationService) {
	$scope.handleInputClick = function(infos, $event) {
		infos.actionTodo = (infos.subscribed) ? "create" : "destroy";
		TableService.addAction(infos);
		var checkbox = $($event.currentTarget),
			cell = $(checkbox).parent(),
			row = cell.parent();
		row.find(".checkbox").attr("disabled", true);
		cell.addClass("clicked");
		$timeout(function() {
			row.find(".checkbox").attr("disabled", false);
			cell.removeClass("clicked");
		}, 2500);
	};
}]);