'use strict';

angular.module('twitterListApp')
   .controller('LoginCtrl', ['$state', '$scope', function($state, $scope) {
      $scope.connect = function() {
   		$state.go('inapp.displayData');
      };
   }]);