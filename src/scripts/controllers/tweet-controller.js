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
   }]);