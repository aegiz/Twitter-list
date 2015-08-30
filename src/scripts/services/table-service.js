'use strict';
angular.module('twitterListApp')
.service('TableService', ['getTwitterInfos', 'InappService', 'SearchService','$q', '$state', function(getTwitterInfos, InappService, SearchService, $q, $state) {
	
	var that = this;
	
	/*
	* Cette fonction va chercher récursivement pour chaque liste leurs utilisateurs.
	* @param {object} lists. Une arrays contenant toutes les listes créées par l'utilisateur
	* @return {Object} listOfLists une array d'arrays
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
				finalList.push({name: list.slug, id:list.id, users: data.users});
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
	* A partir d'une liste d'utilisateurs retourne une matrice contenant toutes les infos pour une cellule
	* @param {Object} users : Une arrays contenant tous les utilisateurs
	* @return {Object} followingList.belongTo : une arrray des lists dans lequel est présent le user + l'id du user et l'id de la liste
	*/

	function buildMatrix(users) {
		var matrix = [];
		_.each(users, function(user) {          
			var belongsToList = {},
				userInfos = {};
			userInfos.name = user.screen_name;
			userInfos.id = user.id;
			userInfos.score = 0;
			_.each(InappService.listOfLists, function(list) {
				var followList = (_.filter(list.users, function(usr) {
					return usr.id === user.id;
					  }).length === 0) ? false : true; // Si l'utilisateur se trouve dans la liste => true sinon false
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
	* Enchaine des calls pour récupérer les followings
	* @param {Object} users. Une arrays contenant tous utilisateur
	* @return {Object} score {id,score,screen_name} des infos sur le user et son score
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
				followings.push(data.users);
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
	* Lance tous les calls de subsciption/unsubscription sur les différents users
	* @param {Array} items. 
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
	* Update de listOflist (TODO : improve this function)
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
	* Update Matrix (score + belongsToList)
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
	* Filtre l'objet matrix pour ne garder que les users qui nous intéresse
	* @param {String} toFilter.
	*/

	this.filterTable = function(toFilter) {
		var updatedMatrix = InappService.matrix;
		if(toFilter === "withoutList") {
			InappService.matrix = _.reject(updatedMatrix, function(item) {
				return item.score !== 0;
			});
			SearchService.initSearch(InappService.matrix);

		} else if(toFilter === "withMultipleLists") {
			InappService.matrix = _.reject(updatedMatrix, function(item) {
				return item.score === 0 || item.score === 1 ;
			});
			SearchService.initSearch(InappService.matrix);
		} else {
			InappService.matrix = buildMatrix(InappService.users);
			SearchService.initSearch(InappService.matrix);
		}
	};

	/*
	* Recupère les datas à afficher dans le tableau
	*/

	this.initializeTableWithDatas = function() {
		// First step : on récupère toutes les listes créé par notre utilisateur
		getTwitterInfos.get('/lists/ownerships').then(function(data) {
			// Deuxième étape: on va récupérer toutes les personnes dans ces listes
			getUsersInLists(data.lists).then(function(data) {
				InappService.listOfLists = _.sortBy(data, function (obj) {return obj.name;}); // liste dans l'ordre alhabétique
				// Troisième étape : on récupére les x dernières personnes suivies par notre utilisateur (max: 200)
				/* 
					Stratégie :
					L'API twitter limite la méthode GET friends/list à 15 calls toutes les 15mins.
					Ainsi on distingue deux cas: 
						- Si la personne a plus de 2800 followings (15 * 200) on chainera 15 calls et on fera la suite 15 min après
						- Si la personne a moins de 2800 followings (majorité des personnes) on chainera le nombre de call correspondants (en priant pour quelle ne rafraichisse pas la page).
				*/
				getTwitterInfos.get('/account/verify_credentials').then(function(data) {
					var callToDo = Math.ceil((data.friends_count) / 200);
					// If more than 2800 followings
					if (callToDo > 15) {
						getFollowings(15).then(function(userResult) {
							// Quatrième étape: construit la score list, la matrix et les users
							InappService.users = _.flatten(userResult);
							InappService.matrix = buildMatrix(InappService.users);
							// Cinquième étape: initialisation des composants tierces
							SearchService.initSearch(InappService.matrix);
							$state.go('inapp.displayData');
							/* TODO : indicate the user that we have to wait 15min now */
						});
					} else {
						getFollowings(callToDo).then(function(userResult) {
							// Quatrième étape: construit la score list, la matrix et les users
							InappService.users = _.flatten(userResult);
							InappService.matrix = buildMatrix(InappService.users);
							// Cinquième étape: initialisation des composants tierces
							SearchService.initSearch(InappService.matrix);
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
