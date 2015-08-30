'use strict';
angular.module('twitterListApp')
.service('TableService', ['getTwitterInfos', 'InappService', 'SearchService', 'PaginationService', '$q', '$state', function(getTwitterInfos, InappService, SearchService, PaginationService, $q, $state) {
	
	var that = this;
	
	/*
	* Get users' infos from a set of lists he owns.
	* @param {Object} lists. An array of lists the user owns.
	* @return {Object} listOfLists An array with gathering the infos.
	*/

	function getUsersInLists(lists) {
		var deferred = $q.defer();
		var finalList = [];
		var loadLists = function (index) {
			var list = lists[index];
			if (!list) {
				deferred.resolve(finalList);
				return finalList;
			}
			getTwitterInfos.get('/lists/members?list_id=' + list.id + '&skip_status=1&count=5000')
			.then(function (data) {
				var cleanUsers = _.map(data.users, function(user) {
					return _.pick(user, "name", "id");
				});
				finalList.push({name: list.slug, id:list.id, users:cleanUsers});
				loadLists(++index); // recursif
			})
			.catch(function (err) {
				deferred.reject(err);
			});
		};
		loadLists(0);
		return deferred.promise;
	}

	/*
	* Build the matrix object from a list of users
	* @param {Object} users : An array of users
	* @return {Object} matrix
	*/

	function buildMatrix(users) {
		var matrix = [];
		_.each(users, function(user) {          
			var belongsToList = {},
				userInfos = {};
			userInfos.name = user.name;
			userInfos.id = user.id;
			userInfos.score = 0;
			_.each(InappService.listOfLists, function(list) {
				var followList = (_.filter(list.users, function(usr) {
					return usr.id === user.id;
					  }).length === 0) ? false : true; // if user is in the list => true else false
				belongsToList[list.name] = {
					"list_id": list.id,
					"user_id": user.id,
					"init_subscribed": followList,
					"subscribed": followList
				};
				if(_.filter(list.users, function(usr) {
					return usr.id === user.id;
				}).length !== 0) {
					userInfos.score ++;
				}
			});
			userInfos.belongsToList = belongsToList;
			matrix.push(userInfos);
		});
		return matrix;
	}

	/*
	* Chain the calls to perform to get the following list
	* @param {Int} callToDo. 
	* @return {Object} followings.
	*/

	function getFollowings(callToDo) {
		var deferred = $q.defer();
		var followings = [];
		var callToDo = callToDo;
		var getFollowing = function (nextCursor) {
			if (callToDo === 0) {
				deferred.resolve(followings);
				return followings;
			}
			getTwitterInfos.get('/friends/list?count=200&cursor='+nextCursor)
			.then(function (data) {
				var cleanUsers = _.map(data.users, function(user) {
					return _.pick(user, "name", "id");
				});
				followings.push(cleanUsers);
				callToDo --;
				getFollowing(data.next_cursor);
			})
			.catch(function (err) {
				deferred.reject(err);
			});
		};

		getFollowing(-1);

		return deferred.promise;
	}

	/*
	* Chain all the calls concerning the subsciption/unsubscription of the targetted users
	* @param {Object} items.
	*/

	this.subscribeUsers = function(items) {
		var deferred = $q.defer();
		var subscribe = function (index) {
			var item = items[index];
			if (!item) {
				deferred.resolve("ok");
				return;
			}
			getTwitterInfos.post('/lists/members/' + item.infosCell.actionTodo + '?list_id=' + item.infosCell.list_id + '&user_id=' + item.infosCell.user_id)
			.then(function (data) {
				subscribe(++index); // recursif
			})
			.catch(function (err) {
				deferred.reject(err);
			});
		};

		subscribe(0);

		return deferred.promise;
	};

	/*
	* Update the listOflist object
    * @param {Object} usersToUpdate. The list of users to update.
    * (TODO : improve this function)
	*/

	this.updateListOfList = function(usersToUpdate) {
		var updatedListOfList = InappService.listOfLists;
		_.each(usersToUpdate, function(userToUpdate) {
			_.each(updatedListOfList, function(list) {
				if(list.id === userToUpdate.infosCell.list_id) {
					// Add new user to array
					if(userToUpdate.infosCell.actionTodo === "create" ) {
						list.users.push({id: userToUpdate.infosCell.user_id});
					// Remove user to Array
					} else {
						for(var i = 0; i< list.users.length; i++) {
							if(list.users[i].id === userToUpdate.infosCell.user_id) {
								list.users.splice(i, 1);
							}
						}
					}
				}
			});
		});         
	};

	/*
	* Update the matrix
    * @param {Object} usersToUpdate. The list of users to update.
	*/

	this.updateMatrix = function(usersToUpdate) {
		var updatedMatrix = InappService.matrix;
		_.each(updatedMatrix, function(usr) {
			_.each(usersToUpdate, function(userToUpdate) {
				if(usr.id === userToUpdate.infosCell.user_id) {
					// Updating score
					usr.score = ((userToUpdate.infosCell.actionTodo === "create") ? usr.score + 1 : usr.score - 1);
					// Updating list belongings
					var listToUpdate = _.findWhere(usr.belongsToList,{list_id:userToUpdate.infosCell.list_id});
					listToUpdate.init_subscribed = listToUpdate.subscribed;
				}
			});
		});
		InappService.matrix = updatedMatrix;
	};

	/*
	* Filter the matrix object to only keep certain users
	* @param {String} toFilter.
	*/

	this.filterTable = function(toFilter) {
		var updatedMatrix = InappService.matrix;
		if(toFilter === "withoutList") {
			InappService.matrix = _.reject(updatedMatrix, function(item) {
				return item.score !== 0;
			});
			PaginationService.groupToPages(InappService.matrix);
		} else if(toFilter === "withMultipleLists") {
			InappService.matrix = _.reject(updatedMatrix, function(item) {
				return item.score === 0 || item.score === 1 ;
			});
			PaginationService.groupToPages(InappService.matrix);
		} else {
			InappService.matrix = buildMatrix(InappService.users);
			PaginationService.groupToPages(InappService.matrix);
		}
	};

	/*
	* Initialize the main table with the correct datas
	*/

	this.initializeTableWithDatas = function() {
		// First step: Get all the list created by the user
		getTwitterInfos.get('/lists/ownerships').then(function(data) {
			// Second set: get all the users in these lists
			getUsersInLists(data.lists).then(function(data) {
				InappService.listOfLists = _.sortBy(data, function (obj) {return obj.name;}); // sort the list in alphabetical order
				// Third step: get the last following of the user (max: 200)
				/* 
					Strategy :
					Due to Api rate limit on the GET friends/list request (15 calls every 15mins)
					We distinguish two cases: 
						- If the user has more than 2800 followings (15 * 200) we will chain the first 15calls and do the rest later.
						- If the user has less than 2800 followings (the majority) we will chain all these calls.
				*/
				getTwitterInfos.get('/account/verify_credentials').then(function(data) {
					var callToDo = Math.ceil((data.friends_count) / 200);
					// If more than 2800 followings
					if (callToDo > 15) {
						getFollowings(15).then(function(userResult) {
							// Fourth step: build the scorelist, matrix and user objects
							InappService.users = _.flatten(userResult);
							InappService.matrix = buildMatrix(InappService.users);
							// Fifth step: initialized the pagination of the matrix
							PaginationService.groupToPages(InappService.matrix);
							$state.go('inapp.displayData');
							/* TODO : indicate the user that we have to wait 15min now */
						});
					} else {
						getFollowings(callToDo).then(function(userResult) {
							// Fourth step: build the scorelist, matrix and user objects
							InappService.users = _.flatten(userResult);
							InappService.matrix = buildMatrix(InappService.users);
							// Fifth step: initialized the pagination of the matrix
							PaginationService.groupToPages(InappService.matrix);
							$state.go('inapp.displayData');
						});
					}
				});
			});
		}, function (error) {
			console.error('handle error: ' + error.stack);
			throw error;
		});
	};

}]);
