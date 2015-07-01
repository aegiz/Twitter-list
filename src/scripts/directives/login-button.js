angular.module('twitterListApp')
   .directive('loginButton', function() { //
      return {
         replace: true,
         restrict: 'E',
         link: function(scope, elem, attrs) {
            elem.bind('click', scope.connect);
         },
         controller: "LoginCtrl",
         templateUrl: 'login.html'
      }
   });