angular.module('twitterListApp')
   .directive('helloWorld', function() { //
      return {
         /*scope:true,*/
         replace: true,
         restrict: 'E',
         link: function(scope, elem, attrs) {
            scope.login = true;
            scope.logout = false;
            elem.find(".twitter-login").bind('click', go);
            //elem.find(".twitter-logout").bind('click', scope.logout);
         },
         controller: "TweetCtrl",
         templateUrl: 'templateList.html'
      }
   });