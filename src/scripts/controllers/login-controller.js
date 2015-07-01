'use strict';

angular.module('twitterListApp')
   .controller('LoginCtrl', ['$log', '$scope', 'Auth', 'User' , function($log, $scope, Auth, User) {
      $scope.connect = function() {
         Auth.login().then(function(user) {
            User.name = user.name;
         }, function(error) {
           console.log(error.message);
         });
      };
   }]);