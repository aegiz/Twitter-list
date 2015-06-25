'use strict';

angular.module('twitterListApp')
   .controller('LoginCtrl', ['$log', '$scope', 'Auth', 'User' , function($log, $scope, Auth, User) {
      $scope.connect = function() {
         Auth.login().then(function(user) {
            User.name = user.name;
            /*$scope.login = true;
            $scope.name = user.name;
            Login.retrieveTable();*/
            //console.log("send event from login");
            //$emit the event to the ctrl
            //$scope.$emit('someEvent', [1,2,3]);
         }, function(error) {
           console.log(error.message);
         });
      };
   }]);