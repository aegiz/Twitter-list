'use strict';

angular.module('twitterListApp')
   .controller('TweetCtrl', ['$log', '$scope', 'getTwitterInfos' , function($log, $scope, getTwitterInfos) {
      var TweetCtrl = this;
      $scope.name = "there... ";
      $scope.login = true;
     
      $scope.displayUsername = function(name) {
         $scope.name = name;
      }

      $scope.$on('someEvent', function (event, data) {
         $scope.login = false;
         $scope.logout = true;
         console.log("receive event from login" + data);
         $scope.$broadcast('toggleAnimation', 'Some data');
      });
   }]);