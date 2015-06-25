'use strict';

angular.module('twitterListApp')
   .directive('listFollowing', function() {
      return {
         replace: true,
         restrict: 'E',
         link: function(scope, elem, attrs) {
            scope.$on("toggleAnimation", function (event, args) {
               console.log("receive in tableau");
               scope.displayUsername("User");
               scope.getTableDatas(100);
            });
         },
         controller: 'TableCtrl',
         templateUrl: 'templateList.html'
      };
   });