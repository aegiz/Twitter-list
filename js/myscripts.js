// Prochain Obj : 
// - bug bouton logout
// - remplacer les données de followingList par celles renvoyées par displayFollowing
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

twitterListApp.factory('getTwitterInfos', ['$http', '$log', function($http, $log) {
   return {
      get: function(url) {
         return Hull.api({
            provider:'twitter',
            path: url
         });
      }
   };
}]);

twitterListApp.directive('helloWorld', function() { //
   return {
      /*scope:true,*/
      replace: true,
      restrict: 'E',
      link: function(scope, elem, attrs) {
         scope.login = true;
         scope.logout = false;
         elem.find(".twitter-login").bind('click', scope.go);
         //elem.find(".twitter-logout").bind('click', scope.logout);
      },
      controller: "TweetCtrl",
      templateUrl: 'templates/templateList.html'
   }
});

twitterListApp.controller('TweetCtrl', ['$log', '$scope', 'getTwitterInfos', function($log, $scope, getTwitterInfos){
   var TweetCtrl = this;
   $scope.name = "there... ";
   $scope.followingList = [
      {
         name: "Following 1",
         belongsToList: {
            List1: true,
            List2: false
         }
      },
      {
         name: "Following 2",
         belongsToList: {
            "List1": false,
            "List2": false
         }
      }
   ];
   $scope.go = function() {
      Hull.login({provider:'twitter'}).then(function(user) {
         $scope.login = false;
         $scope.logout = true;
         $scope.displayUsername(user.name);
         $scope.displayList();
      }, function(error) {
        console.log(error.message);
      });
   }
   $scope.logout = function() {
      $scope.login = true;
      $scope.logout = false;
      Hull.logout();
   }
   $scope.execCallback = function(idArray) {
      $scope.$apply(function () {
         getTwitterInfos.get('/lists/memberships?user_id=' + idArray[0] + '&filter_to_owned_lists=1').then(function(data) {
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
   $scope.displayUsername = function(name) {
      $scope.$apply(function () {
         $scope.name = name;
      });
   }
   $scope.displayList = function() {
      $scope.$apply(function () {
         getTwitterInfos.get('/lists/list').then(function(data) {
            $scope.lists = data;
            $scope.displayFollowing();
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });
      });
   }
   $scope.displayFollowing = function() {
      $scope.$apply(function () {
         // L'idée est la suivante : on récupère tous les ids des followings de l'utilisateur
         // Ensuite pour chacun de ces id on va aller chercher les liste dans lequel il est repertorié avec comme filtre les propres listes de l'utilisateur
         getTwitterInfos.get('/friends/ids?count=3&stringify_ids=1').then(function(data) {
            // On est obligé d'utiliser une recursion pour chainer nos appels
            $scope.execCallback(data.ids);
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });
      });
   }
}]);


