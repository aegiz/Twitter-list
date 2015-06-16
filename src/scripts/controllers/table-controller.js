'use strict';

angular.module('twitterListApp')
   .controller('TableCtrl', ['$log', '$scope', 'getTwitterInfos' , '$q', 'Auth' , function($log, $scope, getTwitterInfos, $q, Auth) {
   
   $scope.lists = [];
   $scope.matrix = [];

   var newListToSubscribeTo = {};

   /*
   * Recupère le clic sur les input
   * Va ensuite repretorier dans une array newListToSubscribeTo les changements au sein du tableau.
   * @param {object} infos toutes les infos à propos de ce champs input
   * @param {number} infos.list_id l'id de la liste associé (en abscisses)
   * @param {string} infos.user_id le nom de l'utilisateur associé (en ordonnées)
   * @param {bool} infos.init_subscribed l'état de l'input à l'origine (true: clicked, false: not clicked)
   * @param {bool} infos.subscribed l'etat de l'input actuellement
   */

   $scope.handleInputClick = function(infos) {
      if(infos.subscribed !== infos.init_subscribed) {
         newListToSubscribeTo[infos.user_id + "-" + infos.list_id] = {
            list_id: infos.list_id,
            screen_name: infos.user_id,
            actionTodo: (infos.subscribed) ? "create" : "destroy"
         };
      } else {
         delete newListToSubscribeTo[infos.user_id + "-" + infos.list_id];
      }
   };

   /*
   * Valide et souscrit les utilisateurs aux nouvelles listes.
   * (Pour cela on utilise les données du tableau newListToSubscribeTo)
   */

   $scope.handleValidation = function() {
      
      // Convert object into array
      newListToSubscribeTo = Object.keys(newListToSubscribeTo).map(function(key) { return newListToSubscribeTo[key]});

      subscribeUsers(newListToSubscribeTo).then(function(data) {
          debugger;
      });
   };

   /*
   * Recupère les datas à afficher dans le tableau
   * @param {number} xFlw. Le nombre de following à afficher
   */

   getTableDatas = function(xFlw) {
      // First step : on récupère toutes les listes créé par notre utilisateur
      getTwitterInfos.get('/lists/ownerships').then(function(data) {
         $scope.lists = data.lists;
         // Deuxième étape: on va récupérer toutes les personnes dans ces listes
         getUsersInLists(data.lists).then(function(data) {
            $scope.listOfLists = data;
            // Troisième étape : on récupére les xFlw dernières personnes suivies par notre utilisateur
            getTwitterInfos.get('/friends/list?count=' + xFlw).then(function(data) {
               $scope.users = data.users;
               // Quatrième étape : on compare et on trie
               $scope.matrix = buildKeyList();
               debugger;
            });
         });
         
      }, function (error) {
         console.error('handle error: ' + error.stack);
         throw error;
      });
   }

   /*
   * Cette fonction va chercher récursivement pour chaque liste leurs utilisateurs.
   * @param {object} lists. Une arrays contenant toutes les listes créé par l'utilisateur
   * @return {Object} listOfLists une array d'arrays
   */

   getUsersInLists = function(lists) {
      
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
            listOfLists.push({name: list.slug, users: data.users});
            loadLists(++index); // recursif
         })
         .catch(function (err) {
            deferred.reject(err);
         });
      }
      loadLists(0);
      return deferred.promise;
   };

   /*
   * Lance tous les calls de subsciption/unsubscription sur les différents users
   */

   subscribeUsers = function(items) {
      var deferred = $q.defer();

      var subscribe = function (index) {
         var item = items[index];
         if (!item) {
            deferred.resolve("ok");
            return;
         }
         getTwitterInfos.post('/lists/members/' + item.actionTodo + '?list_id=' + item.list_id + '&screen_name=' + item.screen_name)
         .then(function (data) {
            subscribe(++index); // recursif
         })
         .catch(function (err) {
            deferred.reject(err);
         });
      }

      subscribe(0);

      return deferred.promise;
   };

   /*
   * Retourne un object contenant toutes les infos pour une cellule
   * @return {Object} belongTo : une arrray des lists dans lequel est présent le user + l'id du user et l'id de la liste
   */

   buildKeyList = function() {
      var followingList = [];
      _.each($scope.users, function(userRow) {
         var belongsToList = {};
         var userInfos = {};
         userInfos["name"] = userRow.screen_name;
         _.each($scope.listOfLists, function(list) {
            belongsToList[list.name] = (_.filter(list.users, function(user) {
                      return user.screen_name === userRow.screen_name;
                  }).length === 0) ? false : true;
         });
         userInfos["belongsToList"] = belongsToList;
         followingList.push(userInfos);
      });
      return followingList;
   }
   
   }]);