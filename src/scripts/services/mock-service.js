'use strict';
angular.module('twitterListApp')
	.factory('mockService', ['isMock', '$http', '$q', function(isMock, $http, $q) {
		return {
			get: function(url) {
				var defered = $q.defer(),
					promise = $http.get("http://localhost:3000" + url);
				
				promise.then(function (response) {
					defered.resolve(response.data[0]);
				})
				.catch(function (err) {
					defered.reject(err);
				});
				return defered.promise;
			},
			post: function(url) {
				var defered = $q.defer(),
					promise = $http.post("http://localhost:3000" + url);

				promise.then(function (response) {
					defered.resolve(response.data[0]);
				})
				.catch(function (err) {
					defered.reject(err);
				});
				return defered.promise;
			}
		};
	}]);