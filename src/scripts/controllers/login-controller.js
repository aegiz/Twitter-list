'use strict';

angular.module('twitterListApp')
   .controller('LoginCtrl', ['$log', '$scope', 'AuthService', 'UserService' , function($log, $scope, AuthService, UserService) {
      $scope.connect = function() {
         AuthService.login().then(function(user) {
            UserService.name = user.name;
         }, function(error) {
           console.log(error.message);
         });
      };
   }]);