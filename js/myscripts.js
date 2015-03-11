// Obj du matin : coupler la recuération de donnée sur l'api de twitter
// Obj soir : afficher pour les 7 premiers following s'il appartient aux listes + optionnal comprendre comment utiliser ng-show / ng-hide 
// Todo : mettre le tout dans un callback au niveau du foreach

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
         // L'idée c'est : on récupère tous les ids des followings
         // On affiche les listes dans laquelle ils sont listés avec comme filtre ses propres listes
         // + utiliser le curseur pour looper sur les différentes array de résultats https://dev.twitter.com/overview/api/cursoring
         getTweets.get('/friends/ids?count=7&stringify_ids=1').then(function(data) {

            data.ids.forEach(function(id) {
               debugger;
               getTweets.get('/lists/memberships?user_id=' + id + '&filter_to_owned_lists=1').then(function(data) {
                  //$scope.$apply(function () {
                    //$scope.tweets = data;
                  //});
                  debugger;
               }, function (error) {
                     console.error('handle error: ' + error.stack);
                     throw error;
               });
            });

           
            
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });

         

      });
   }
}]);


