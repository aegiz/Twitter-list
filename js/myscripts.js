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


twitterListApp.controller('TweetCtrl', ['$scope', function($scope){
   var TweetCtrl = this;

   $scope.go = function() {
      var testName = "there";
      $scope.name = testName;
      Hull.login({provider:'twitter'}).then(function(user) {
         
         testS(user.name);
         
      }, function(error) {
        console.log(error.message);
      });
   }
   $scope.testS = function(newName) {
      debugger;
      $scope.name = newName;
   }
   $scope.displayTweets = function() {
      Hull.api({
        provider:'twitter',
        path:'/statuses/home_timeline'
      },function(result){
        console.log('This is the result', result);
        for (var i = result.length - 1; i >= 0; i--) {
           TweetCtrl.tweets = result[i];
        };
      });
   }
}]);

