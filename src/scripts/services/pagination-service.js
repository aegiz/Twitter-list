'use strict';
// From : http://jsfiddle.net/SAWsA/11/ 
angular.module('twitterListApp')
.service('PaginationService', ['getTwitterInfos', 'InappService', '$filter', function(getTwitterInfos, InappService, $filter) {
   var itemsPerPage = 100;

   /*
   * Regroupe la liste d'item en sous groupes
   * @param {Object} filteredItems. Les items à regrouper
   */

   this.groupToPages = function (filteredItems) {
      var pagedItems = [];
      for (var i = 0; i < filteredItems.length; i++) {
         if (i % itemsPerPage === 0) {
            pagedItems[Math.floor(i / itemsPerPage)] = [ filteredItems[i] ];
         } else {
            pagedItems[Math.floor(i / itemsPerPage)].push(filteredItems[i]);
         }
      }
      InappService.currentPage = 0;
      InappService.pagedItems = pagedItems;
   };

   this.setNewPage =function(newValue) {
      InappService.currentPage = newValue;
   };
}]);
