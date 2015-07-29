'use strict';

angular.module('twitterListApp')
   .controller('SearchCtrl', ['$scope', 'SearchService', function($scope, SearchService) {
      $scope.search = function () {
         SearchService.search($scope.matrix, $scope.query);
      };
   }]);