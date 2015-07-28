'use strict';
// From : http://jsfiddle.net/SAWsA/11/ 
angular.module('twitterListApp')
.factory('PaginationService', ['getTwitterInfos', 'InappService', '$filter', function(getTwitterInfos, InappService, $filter) {
   var groupedItems = [];
   var itemsPerPage = 5;
   var pagedItems = [];
   return {
      groupToPages: function (filteredItems) {
         for (var i = 0; i < filteredItems.length; i++) {
            if (i % itemsPerPage === 0) {
               pagedItems[Math.floor(i / itemsPerPage)] = [ filteredItems[i] ];
            } else {
               pagedItems[Math.floor(i / itemsPerPage)].push(filteredItems[i]);
            }
         }
         InappService.pagedItems = pagedItems;
      },
      setNewPage: function(newValue) {
         InappService.currentPage = newValue;
      }
   };
}]);
