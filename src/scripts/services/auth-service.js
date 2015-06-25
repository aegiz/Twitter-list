'use strict';
angular.module('twitterListApp')
.service('Auth', function (HullService) {
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
