'use strict';
angular.module('twitterListApp')
.service('SearchService', ['PaginationService', '$filter', function(PaginationService, $filter) {
   var filteredItems = [];

   var searchMatch = function (haystack, needle) {
      if (!needle) {
         return true;
      }
      return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
   };

   this.initSearch = function(matrix) {
      filteredItems = $filter('filter')(matrix, function (item) {
         return true;
      });
      PaginationService.groupToPages(filteredItems);
   }

   this.search = function (matrix, query) {
      filteredItems = $filter('filter')(matrix, function (item) {
         if (searchMatch(item.name, query)) {
            return true;
         }
         return false;
      });
      PaginationService.groupToPages(filteredItems);
   };
}]);
