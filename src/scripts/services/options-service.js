'use strict';
angular.module('twitterListApp')
.service('OptionsService', ['InappService', 'PaginationService', 'TableService', 'getTwitterInfos', function(InappService, PaginationService, TableService, getTwitterInfos) {
	this.createList = function() {
		var rand = Math.floor((Math.random() * 1000) + 1);
		getTwitterInfos.post('/lists/create?name=newList' + rand)
		.then(function (data) {
			// Refresh listOfLists
			InappService.listOfLists.push({
				id: data.id,
				name: data.name,
				users: []
			});
			// Refresh table values
			TableService.initMatrix();
			TableService.fillTable("noFilter");
			PaginationService.initializeUserNb(InappService.users.length);
			PaginationService.groupToPages(InappService.matrix);

		})
		.catch(function (err) {
			deferred.reject(err);
		});
	};
}]);
