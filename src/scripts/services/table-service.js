'use strict';
angular.module('twitterListApp')
.service('TableService', ['getTwitterInfos', 'InappService', 'SearchService','$q', function(getTwitterInfos, InappService, SearchService, $q) {
   
   var listOfLists,
      users,
      scoreList,
      matrix;
   
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
   * Retourne un object contenant toutes les infos pour une cellule
   * @param {Object} users. Une arrays contenant tous utilisateur
   * @return {Object} belongTo : une arrray des lists dans lequel est présent le user + l'id du user et l'id de la liste
   */

   function buildKeyList(users) {
      var followingList = [];
      _.each(users, function(userRow) {
         var belongsToList = {};
         var userInfos = {};
         userInfos.name = userRow.screen_name;
         _.each(listOfLists, function(list) {
            var followList = (_.filter(list.users, function(user) {
                      return user.screen_name === userRow.screen_name;
                  }).length === 0) ? false : true; // Si l'utilisateur se trouve dans la liste => true sinon false
            belongsToList[list.name] = {
               "list_id": list.id,
               "user_id": userRow.id,
               "init_subscribed": followList,
               "subscribed": followList,

            };
         });
         userInfos.belongsToList = belongsToList;
         followingList.push(userInfos);
      });
      return followingList;
   }

   /*
   * Pour chaque ids de personne suivi on établit un score de nombre de listes dans lequel il est présent
   * @param {Object} users. Une arrays contenant tous utilisateur
   * @return {Object} score {id,score,screen_name} des infos sur le user et son score
   */

   function buildScoreList(users) {
      var score = [];
      
      _.each(users, function(user) {
         var infoUser = {
            "id": user.id,
            "screen_name": user.screen_name,
            "score": 0
         };
         _.each(listOfLists, function(list) {
            if(_.filter(list.users, function(usr) {
                  return usr.id === user.id;
               }).length !== 0) {
               infoUser.score ++;
            }
         });
         score.push(infoUser);
      });
      return score;
   }

   /*
   * Lance tous les calls de subsciption/unsubscription sur les différents users
   * @param {Object} items. Une arrays d'objects contenant : l'action to do (destroy ou create) et divers type d'info (infosOnAction) sur la list le user etc.
   */

   this.subscribeUsers = function(items) {
      var deferred = $q.defer();

      var subscribe = function (index) {
         var item = items[index];
         if (!item) {
            deferred.resolve("ok");
            return;
         }
         getTwitterInfos.post('/lists/members/' + item.actionTodo + '?list_id=' + item.infosOnAction.list_id + '&user_id=' + item.infosOnAction.user_id)
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
   * Patch la valeur matrix du tableau en fonction de la valeur de la checkbox  Select only users without lists
   * @param {Boolean} toFilter. true: filter sinon rétablir
   */

   this.filterTable = function(toFilter) {
      if(toFilter) {
         var scoreListW0 = _.filter(scoreList, function(list) {
             return list.score === 0;
         });
         InappService.matrix = matrix = buildKeyList(scoreListW0);
         SearchService.initSearch(matrix);
      } else {
         InappService.matrix = matrix = buildKeyList(users);
         SearchService.initSearch(matrix);
      }
   };

   /*
   * Recupère les datas à afficher dans le tableau
   * @param {number} xFlw. Le nombre de following à afficher
   */

   this.initializeTableWithDatas = function(xFlw) {
      // First step : on récupère toutes les listes créé par notre utilisateur
      getTwitterInfos.get('/lists/ownerships').then(function(data) {
         // Deuxième étape: on va récupérer toutes les personnes dans ces listes
         getUsersInLists(data.lists).then(function(data) {
            InappService.listOfLists = listOfLists = _.sortBy(data, function (obj) {return obj.name;});
            // Troisième étape : on récupére les xFlw dernières personnes suivies par notre utilisateur (max: 200)
            getTwitterInfos.get('/friends/list?count=' + xFlw).then(function(data) {
               // Quatrième étape: construit la score list, la matrix et les users
               InappService.users = users = data.users;
               InappService.scoreList = scoreList = buildScoreList(_.map(users, function(obj) { return _.pick(obj, 'id', 'screen_name'); })); // on ne recupère que les deux valeurs qui ous intéresse
               InappService.matrix = matrix = buildKeyList(users, true);

               // Cinquième étape: initialisation des composants tierces
               SearchService.initSearch(matrix);
            });
         });
      }, function (error) {
         console.error('handle error: ' + error.stack);
         throw error;
      });
   };

}]);
