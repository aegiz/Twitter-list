'use strict';

angular.module('twitterListApp')
   .controller('LoginCtrl', ['$log', '$scope', 'getTwitterInfos' , 'Auth' , function($log, $scope, getTwitterInfos, Auth) {
      $scope.go = function() {
         Auth.login().then(function(user) {
            console.log("send event from login");
            //$emit the event to the ctrl
            $scope.$emit('someEvent', [1,2,3]);
         }, function(error) {
           console.log(error.message);
         });
      };
   }]);