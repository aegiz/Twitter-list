angular.module('twitterListApp')
   .directive('loginButton', function() { //
      return {
         /*scope:true,*/
         replace: true,
         restrict: 'E',
         link: function(scope, elem, attrs) {
            /*scope.login = true;
            scope.logout = false;*/
            elem.bind('click', go);
         },
         controller: "LoginCtrl",
         templateUrl: 'login.html'
      }
   });