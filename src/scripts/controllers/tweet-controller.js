'use strict';

angular.module('twitterListApp')
   .controller('TweetCtrl', ['$log', '$scope', 'getTwitterInfos' , function($log, $scope, getTwitterInfos) {
      var TweetCtrl = this;
      $scope.name = "there... ";
      $scope.followingList = [];
      $scope.lists = [];

      $scope.login = true;
      $scope.logout = false;

      /*logout = function() {
         $scope.login = true;
         $scope.logout = false;
         Hull.logout();
      }*/
      
      displayUsername = function(name) {
         $scope.name = name;
      }

      $scope.$on('someEvent', function (event, data) {
         $scope.login = false;
         $scope.logout = true;
        console.log("receive event from login" + data);
        $scope.$broadcast('toggleAnimation', 'Some data');
      });

      isPartOfList = function(returnList) {
         var belongTo = {};
         $scope.lists.map(function(list) {
            belongTo[list.name] = false;
         });
         returnList.map(function(list) {
            belongTo[list.name] = true;
         });
         return belongTo;
      }

      execCallback = function(userArray) {
            // ... Ensuite pour chacun des followings on va aller chercher les listes dans lesquelles il a été repertoriée (avec comme filtre les propres listes de l'utilisateur)
            getTwitterInfos.get('/lists/memberships?user_id=' + userArray[0].id + '&filter_to_owned_lists=1').then(function(data) {
               userArray[0]["belongsToList"] =  isPartOfList(data.lists);
               $scope.followingList.push(userArray[0]);
               userArray.shift(); // on dépile la cellule que l'on vient de faire
               if(userArray.length !== 0) {
                  execCallback(userArray);
               }
            }, function (error) {
                  console.error('handle error: ' + error.stack);
                  throw error;
            });
      }

      displayList = function() {
         // On affiche toutes les listes dans la première rangée
         getTwitterInfos.get('/lists/ownerships').then(function(data) {
            $scope.lists = data.lists;
            displayFollowing();
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });
      }
      
      displayFollowing = function() {
         // L'idée est la suivante : on récupère tous les infos concernant les followings ...
         getTwitterInfos.get('/friends/list?count=10').then(function(data) {
            execCallback(data.users);
         }, function (error) {
               console.error('handle error: ' + error.stack);
               throw error;
         });
      }
   }]);