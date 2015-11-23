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
			userInfos.screen_name = user.screen_name;
			userInfos.profile_image_url = user.profile_image_url;
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
					return _.pick(user, "name", "id", "screen_name", "profile_image_url");
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
	* Queue the actions concerning the subscription or removal of selected users
    * @param {Object} infos. Some relevant infos concerning what to do
	*/

	that.actionStack = [];
	this.addAction = function(infos) {
		that.actionStack.push(infos);
		var launchAction = function(actionNb) {
			var deferred = $q.defer();
			getTwitterInfos.post('/lists/members/' + that.actionStack[actionNb].actionTodo + '?list_id=' + that.actionStack[actionNb].list_id + '&user_id=' + that.actionStack[actionNb].user_id)
			.then(function (data) {
				// Update & Clean
				that.updateListOfList(infos);
				that.updateUsers(infos);
				that.actionStack.shift();
				if(that.actionStack.length !==0) {
					// Do the next action
					launchAction(0);
				}
				deferred.resolve(data);
				return;
			})
			.catch(function (err) {
				deferred.reject(err);
			});
		};
		
		// If only one action execute it immediatemy
		if(that.actionStack.length === 1) {
			launchAction(0);
		}
	}
	

	/*
	* Update the listOflist object
    * @param {Object} usersToUpdate. The list of users to update.
    * (TODO : improve this function with the for loop - bad)
	*/

	that.updateListOfList = function(userToUpdate) {
		var updatedListOfList = InappService.listOfLists;
		_.each(updatedListOfList, function(list) {
			if(list.id === userToUpdate.list_id) {
				// Add new user to array
				if(userToUpdate.actionTodo === "create" ) {
					list.users.push({id: userToUpdate.user_id});
				// Remove user to Array
				} else {
					for(var i = 0; i< list.users.length; i++) {
						if(list.users[i].id === userToUpdate.user_id) {
							list.users.splice(i, 1);
						}
					}
				}
			}
		});       
	};

	/*
	* Update the users' array with the correct score and belongtolist
    * @param {Object} userToUpdate. The list of users to update.
	*/

	that.updateUsers = function(userToUpdate) {
		var updatedMatrix = InappService.matrix;
		_.each(updatedMatrix, function(usr) {
			if(usr.id === userToUpdate.user_id) {
				// Updating score
				usr.score = ((userToUpdate.actionTodo === "create") ? usr.score + 1 : usr.score - 1);
				// Updating list belongings
				var listToUpdate = _.findWhere(usr.belongsToList,{list_id:userToUpdate.list_id});
				listToUpdate.init_subscribed = listToUpdate.subscribed;
			}
		});
		InappService.users = updatedMatrix;
		that.updateTable(InappService.filterInfos.currentTab);
	};

	/*
	* Update the table to present the correct datas (list count in topbar, users according to the filters)
	* @param {String} toFilter.
	*/

	that.updateTable = function(toFilter) {
		// Build the matrix
		InappService.matrix = buildMatrix(InappService.users);
		var matrixWithoutList = _.reject(InappService.matrix, function(item) {
			return item.score !== 0;
		});
		var matrixWithMultiList = _.reject(InappService.matrix, function(item) {
			return item.score === 0 || item.score === 1 ;
		});
		// Filters'tab update
		InappService.filterInfos = {
			"currentTab": toFilter,
			"noFilterLength" : InappService.matrix.length,
			"withoutListLength": matrixWithoutList.length,
			"withMultiListLength": matrixWithMultiList.length
		};
		// Group to pages to present the data
		switch (toFilter) {
			case "noFilter":
				PaginationService.groupToPages(InappService.matrix);
				break;
			case "withoutList":
				// only update the PageItem value cause we want to keep the matrix value clean
				PaginationService.groupToPages(matrixWithoutList); 
				break;
			case "withMultiList":
				PaginationService.groupToPages(matrixWithMultiList);
				break;
			default: 
				console.log("Error toFilter is not defined");
		}
	};

	/*
	* Initialize the main table with the correct datas
	*/

	this.initializeTableWithDatas = function() {
		// First step: Get all the lists created by the user
		getTwitterInfos.get('/lists/ownerships').then(function(data) {
			if(data.lists.length === 0) {
				InappService.listOfLists = [{name:"First List..."}, {name:"Second List..."}];
				getFollowings(1).then(function(userResult) {
					InappService.users = _.flatten(userResult);
					InappService.matrix = buildMatrix(InappService.users);
					PaginationService.initializeUserNb(InappService.users.length);
					PaginationService.groupToPages(InappService.matrix);
					$state.go('inapp.displayDataEmptyList');
				});
			} else {
				// Second step: get all the users in these lists
				getUsersInLists(data.lists).then(function(data) {
					InappService.listOfLists = _.sortBy(data, function (obj) {return obj.name;}); // sort the list in alphabetical order
					// Third step: get the last followings of the user (max: 200)
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
								that.updateTable("noFilter");
								//InappService.matrix = buildMatrix(InappService.users);
								// Fifth step: initialized the pagination of the matrix
								PaginationService.initializeUserNb(InappService.users.length);
								PaginationService.groupToPages(InappService.matrix);
								$state.go('inapp.displayData');
								/* TODO : indicate the user that we have to wait 15min now */
							});
						} else {
							getFollowings(callToDo).then(function(userResult) {
								// Fourth step: build the scorelist, matrix and user objects
								InappService.users = _.flatten(userResult);
								that.updateTable("noFilter");
								//InappService.matrix = buildMatrix(InappService.users);
								// Fifth step: initialized the pagination of the matrix
								PaginationService.initializeUserNb(InappService.users.length);
								PaginationService.groupToPages(InappService.matrix);
								$state.go('inapp.displayData');
							});
						}
					});
				});
			}
		}, function (error) {
			console.error('handle error: ' + error.stack);
			throw error;
		});
	};

}]);
