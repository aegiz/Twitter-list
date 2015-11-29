'use strict';

angular.module('twitterListApp')
.controller('OptionsCtrl', ['$scope', 'OptionsService', function($scope, OptionsService) {
	$scope.addNewList = function() {
		OptionsService.createList();
	}
}]);