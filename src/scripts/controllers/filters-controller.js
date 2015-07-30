'use strict';

angular.module('twitterListApp')
   .controller('FiltersCtrl', ['$scope', 'FiltersService', function($scope, FiltersService) {
      $scope.checked = false;
      $scope.filter = function (checked) {
         FiltersService.filter(checked);
      };
   }]);