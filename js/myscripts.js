Hull.init({
   appId : "54db24c7e4bd981bee000281",
   orgUrl: "https://6e082fcc.hullapp.io",
   debug:false,
}, function(hull) {
   console.log("Hull is initialized for app", hull.config());
});

 // On auth success
var $twitter_login = $(".twitter-login");
var refreshButton = function() {
   var user = Hull.currentUser();
   if (user) {
      $twitter_login.html("Connected as " + user.name + ". Logout");
   } else {
      $twitter_login.html("Login with Twitter");
   }
}

Hull.on('hull.auth.login', function(me) {
   
})

// ANGULAR :

var twitterListApp = angular.module("twitterListApp", []);


/*twitterListApp.directive("getTweets", function(){
   return {
      restrict: "E",
   }
});*/


twitterListApp.controller('TweetCtrl', ['$scope', function($scope){
   var TweetCtrl = this;
   $scope.displayTweets = function(){
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

// Let's react to all events prefixed by 'hull.auth'
Hull.on('hull.auth.*', refreshButton);

