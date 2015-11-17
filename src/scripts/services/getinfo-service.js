'use strict';
angular.module('twitterListApp')
	.factory('getTwitterInfos', ['isMock', '$http', '$log', '$q', 'mockService', function(isMock, $http, $log, $q, mockService) {
		return {
			get: function(url) {
				var defered = $q.defer();
				if(!isMock) {
					Hull.api({
						provider:'twitter',
						path: url
					}, 'get')
					.then(function (response) {
						defered.resolve(response);
					})
					.catch(function (err) {
						defered.reject(err);
					});
					return defered.promise;
				} else {
					mockService.get(url)
					.then(function (response) {
						defered.resolve(response);
					})
					.catch(function (err) {
						defered.reject(err);
					});
					return defered.promise;
				}
			},
			post: function(url) {
				var defered = $q.defer();
				if(!isMock) {
					Hull.api({
						provider:'twitter',
						path: url
					}, 'post').then(function (response) {
						defered.resolve(response);
					});
					return defered.promise;
				} else {
					mockService.post(url)
					.then(function (response) {
						defered.resolve(response);
					})
					.catch(function (err) {
						defered.reject(err);
					});
					return defered.promise;
				}
			}
		};
	}]);