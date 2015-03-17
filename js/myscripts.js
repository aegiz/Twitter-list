// Prochain Obj : 
// - comprendre pourquoi les colonnes se réorganisent d'un seul coup à la fin

// Todo: 
// - utiliser les curseurs pour gérer la pagination
// - bug bouton logout
// - valider la souscription à une nouvelle listes

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
   $scope.followingList = [];
   $scope.lists = [];
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
   $scope.isPartOfList = function(returnList) {
      var belongTo = {};
      $scope.lists.map(function(list) {
         belongTo[list.name] = false;
      });
      returnList.map(function(list) {
         belongTo[list.name] = true;
      });
      return belongTo;
   }
   $scope.execCallback = function(userArray) {
      $scope.$apply(function () {
         // ... Ensuite pour chacun des followings on va aller chercher les listes dans lesquelles il a été repertoriée (avec comme filtre les propres listes de l'utilisateur)
         getTwitterInfos.get('/lists/memberships?user_id=' + userArray[0].id + '&filter_to_owned_lists=1').then(function(data) {
            userArray[0]["belongsToList"] =  $scope.isPartOfList(data.lists);
            $scope.$apply(function () {
               $scope.followingList.push(userArray[0]);
            });
            userArray.shift(); // on dépile la cellule que l'on vient de faire
            if(userArray.length !== 0) {
               $scope.execCallback(userArray);
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
         // On affiche toutes les listes dans la première rangée
         getTwitterInfos.get('/lists/ownerships').then(function(data) {
            $scope.lists = data.lists;
            $scope.displayFollowing();
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });
      });
   }
   $scope.displayFollowing = function() {
      $scope.$apply(function () {
         // L'idée est la suivante : on récupère tous les infos concernant les followings ...
         getTwitterInfos.get('/friends/list?count=10').then(function(data) {
            $scope.execCallback(data.users);
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });
      });
   }
}]);

/* 
Questions :
   - Pourquoi quand je fais un appel à une fonction sans mettre le $scope je n'ai pas d'erreur ?
   - Pourquoi ne puis-je pas faire deux appels à l'API de twitter en même temps
   - Comment réduire mon nombre de requêtes pour ne plus avoir l'erreur du nombre de requêtes atteint
   - Vaut-il mieux externaliser tous le code dans un controlleur externe ou bien utiliser la propriété controller proposé par une directive ?
*/

