// Obj du matin : Rassembler le call à Hull dans une factory
// Obj journée : comprendre comment utiliser ng-show / ng-hide

Hull.init({
   appId : "54db24c7e4bd981bee000281",
   orgUrl: "https://6e082fcc.hullapp.io",
   debug:false,
}, function(hull) {
   console.log("Hull is initialized for app", hull.config());
});


// ANGULAR :

var twitterListApp = angular.module("twitterListApp", []);


/*twitterListApp.directive("getTweets", function(){
   return {
      restrict: "E",
   }
});*/

twitterListApp.factory('getTweets', ['$http', '$log', function($http, $log) {
   return {
      get: function(url) {
         return Hull.api({
            provider:'twitter',
            path: url
         });
      }
   };
}]);

twitterListApp.controller('TweetCtrl', ['$log', '$scope', 'getTweets', function($log, $scope, getTweets){
   var TweetCtrl = this;
   $scope.name = "there";
   $scope.go = function() {
      Hull.login({provider:'twitter'}).then(function(user) {
        $scope.displayUsername(user.name);
        $scope.displayTweets();
      }, function(error) {
        console.log(error.message);
      });
   }
   $scope.displayUsername = function(hop) {
      $scope.$apply(function () {
         $scope.name = hop;
      });
   }
   $scope.displayTweets = function() {
      $scope.$apply(function () {
         getTweets.get('/statuses/home_timeline').then(function(data) {
            $scope.$apply(function () {
              $scope.tweets = data;
            });
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });

      });
   }
}]);


