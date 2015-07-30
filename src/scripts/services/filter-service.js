'use strict';
angular.module('twitterListApp')
.service('FiltersService', ['TableService', function(TableService) {
   this.filter = function (checked) {
      TableService.filterTable(checked);
   };
}]);
