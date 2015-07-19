'use strict';
angular.module('twitterListApp')
.factory('TableService', ['getTwitterInfos', '$q', function(getTwitterInfos, $q) {

   var tableDatas = {};

   /*
   * Cette fonction va chercher récursivement pour chaque liste leurs utilisateurs.
   * @param {object} lists. Une arrays contenant toutes les listes créé par l'utilisateur
   * @return {Object} listOfLists une array d'arrays
   */

   function getUsersInLists(lists) {
      
      var deferred = $q.defer();
      var listOfLists = [];
      var loadLists = function (index) {
         var list = lists[index];
         if (!list) {
            deferred.resolve(listOfLists);
            return listOfLists;
         }
         getTwitterInfos.get('/lists/members?list_id=' + list.id + '&skip_status=1&count=5000')
         .then(function (data) {
            listOfLists.push({name: list.slug, id:list.id, users: data.users});
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
   * 
   * @return {Object} belongTo : une arrray des lists dans lequel est présent le user + l'id du user et l'id de la liste
   */

   function buildKeyList(users, testListBelonging) {
      var followingList = [];
      _.each(users, function(userRow) {
         var belongsToList = {};
         var userInfos = {};
         userInfos.name = userRow.screen_name;
         _.each(tableDatas.listOfLists, function(list) {
            if(testListBelonging) {
               var followList = (_.filter(list.users, function(user) {
                         return user.screen_name === userRow.screen_name;
                     }).length === 0) ? false : true; // Si l'utilisateur se trouve dans la liste => true sinon false
               belongsToList[list.name] = {
                  "list_id": list.id,
                  "user_id": userRow.id,
                  "init_subscribed": followList,
                  "subscribed": followList,

               };
            } else {
               _.each(tableDatas.listOfLists, function(list) {
                  belongsToList[list.name] = {
                     "list_id": list.id,
                     "user_id": userRow.id,
                     "init_subscribed": false,
                     "subscribed": false,
                  };
               });
            }
         });
         userInfos.belongsToList = belongsToList;
         followingList.push(userInfos);
      });
      return followingList;
   }

   /*
   * L'idée : pour chaque ids de personne suivi on va établir un score de nombre de listes dans lequel il est présent
   */

   function buildScoreList(users) {
      var score = [];
      
      _.each(users, function(user) {
         var infoUser = {
            "id": user.id,
            "screen_name": user.screen_name,
            "score": 0
         };
         _.each(tableDatas.listOfLists, function(list) {
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

   return {

      tableDatas: tableDatas,

      /*
      * Recupère les datas à afficher dans le tableau
      * @param {number} xFlw. Le nombre de following à afficher
      */

      initializeTableWithDatas: function(xFlw, testOnlyNoList) {
         // First step : on récupère toutes les listes créé par notre utilisateur
         getTwitterInfos.get('/lists/ownerships').then(function(data) {
            // Deuxième étape: on va récupérer toutes les personnes dans ces listes
            getUsersInLists(data.lists).then(function(data) {
               tableDatas.listOfLists = _.sortBy(data, function (obj) {return obj.name;});
               // Troisième étape : on récupére les xFlw dernières personnes suivies par notre utilisateur (max: 200)
               getTwitterInfos.get('/friends/list?count=' + xFlw).then(function(data) {
                  tableDatas.users = data.users;
                  if(testOnlyNoList) {
                     // Quatrième étape : on score chaque user avec le nombre de liste dans lequel il est présent
                     tableDatas.scoreList = buildScoreList(_.map(data.users, function(obj) { return _.pick(obj, 'id', 'screen_name'); })); // on ne recupère que les deux valeurs qui ous intéresse
                     //Ensuite on trie le tableau en ne récupérant que ceux qui ont un score de 0
                     var scoreListW0 = _.filter(scoreList, function(list) {
                         return list.score === 0;
                     });
                     // Cinquième étape on compare et on trie
                     tableDatas.matrix = buildKeyList(scoreListW0, false);
                  } else {
                     // Quatrième étape : on compare et on trie
                     tableDatas.matrix = buildKeyList(data.users, true);
                  }
               });
            });
         }, function (error) {
            console.error('handle error: ' + error.stack);
            throw error;
         });
      },

      /*
      * Lance tous les calls de subsciption/unsubscription sur les différents users
      */

      subscribeUsers : function(items) {
         var deferred = $q.defer();

         var subscribe = function (index) {
            var item = items[index];
            if (!item) {
               deferred.resolve("ok");
               return;
            }
            getTwitterInfos.post('/lists/members/' + item.actionTodo + '?list_id=' + item.monObj.list_id + '&user_id=' + item.monObj.user_id)
            .then(function (data) {
               subscribe(++index); // recursif
            })
            .catch(function (err) {
               deferred.reject(err);
            });
         };

         subscribe(0);

         return deferred.promise;
      }
   
   };
}]);
