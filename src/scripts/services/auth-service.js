'use strict';
angular.module('twitterListApp')
.service('AuthService', function (HullService) {
   this.login = function () {
      return HullService.login();
   };
   
   this.logout = function () {
      return HullService.logout();
   };

   this.currentUser = function () {
      return HullService.currentUser();
   };

   this.currentApp = function () {
      return HullService.currentApp();
   };
});
