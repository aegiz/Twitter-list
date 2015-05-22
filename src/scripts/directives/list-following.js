angular.module('twitterListApp')
   .directive('listFollowing', function() { //
      return {
         /*scope: { TweetCtrl: '=' },*/
         replace: true,
         restrict: 'E',
         link: function(scope, elem, attrs) {
            scope.$on("toggleAnimation", function (event, args) {
               console.log("receive in tableau");
               displayUsername("User");
               displayList();
            });
         },
         templateUrl: 'templateList.html'
      }
   });