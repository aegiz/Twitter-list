'use strict';
angular.module('twitterListApp')
   .provider('HullService', function () {
      var _host, _appId, _hull = {};
      this.setHost = function (host) {
         _host = host;
      };

      this.setAppId = function (appId) {
         _appId = appId;
      };

      this.$get = function ($q) {
      var _user = {},
            _h = {},
            _initDeferred = $q.defer(),
            _hullPromise;

      window.Hull.init({
         "orgUrl": _host,
         "appId": _appId
      },function(hull, user, app, org){
         _h = hull;
         _user = user;
         _initDeferred.resolve({
            hull: _h, 
            user: _user, 
            app: app, 
            org: org
         });
      });

      _hullPromise = _initDeferred.promise;
      
      // Auth 
      _hull.login = function () {
         return _hullPromise.then(function () {
            return _h.login('twitter').then(function (user) {
            _user = user;
            return _user;
            });
         });
      };

      _hull.logout = function () {
         return _hullPromise.then(function () {
            return _h.logout().then(function () {
            _user = null;
            return true;
            });
         });
      };

      _hull.currentUser = function () {
         return _hullPromise.then(function () {
            if (_user) {
            return _user;
            } else {
            return _h.api('me');
            }
         });
      };

      _hull.currentApp = function () {
         return _hullPromise.then(function (hull) {
            return hull.app;
         });
      };

      return _hull;
   }
});