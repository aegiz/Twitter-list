'use strict';
angular.module('twitterListApp')
	.factory('getTwitterInfos', ['$http', '$log', '$q', function($http, $log, $q) {
		return {
			get: function(url) {
				var defered = $q.defer();
				Hull.api({
					provider:'twitter',
					path: url
				}).then(function (response) {
					defered.resolve(response);
				});
				return defered.promise;
			}
		};
	}]);