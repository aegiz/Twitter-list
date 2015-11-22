'use strict';

angular.module('twitterListApp')
   .controller('SearchCtrl', ['$scope', 'SearchService', function($scope, SearchService) {
      $scope.search = function () {
      	// changer avec Paged-item plutot
         SearchService.search($scope.matrix, $scope.query);
      };
   }]);