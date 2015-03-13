// Prochain Obj : créer une directive pour afficher les différentes listes dans des encarts spécifiques
// Todo: utiliser les curseurs pour gérer la pagination

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
   $scope.execCallback = function(idArray) {
      $scope.$apply(function () {
         getTweets.get('/lists/memberships?user_id=' + idArray[0] + '&filter_to_owned_lists=1').then(function(data) {
            console.log(data);
            idArray.shift();
            if(idArray.length !== 0) {
               $scope.execCallback(idArray);
            }
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });
      });
   }
   $scope.displayUsername = function(hop) {
      $scope.$apply(function () {
         $scope.name = hop;
      });
   }
   $scope.displayTweets = function() {
      $scope.$apply(function () {
         // L'idée est la suivante : on récupère tous les ids des followings de l'utilisateur
         // Ensuite pour chacun de ces id on va aller chercher les liste dans lequel il est repertorié avec comme filtre les propres listes de l'utilisateur
         getTweets.get('/friends/ids?count=3&stringify_ids=1').then(function(data) {
            // On est obligé d'utiliser une recursion pour chainer nos appels
            $scope.execCallback(data.ids);
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });
      });
   }
}]);


