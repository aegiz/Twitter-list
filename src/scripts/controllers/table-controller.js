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
      // First step : on récupère toutes les listes pour l'axe des abscisses
      getTwitterInfos.get('/lists/ownerships').then(function(data) {
         $scope.lists = data.lists;
         // Pour compléter le reste des cellules on doit commencer par récupérer les xFlw derniers followings
         getTwitterInfos.get('/friends/list?count=' + xFlw).then(function(data) {
            readUsers(data.users).then(function(data) {
               $scope.matrix = data;
            });
         });
      }, function (error) {
         console.error('handle error: ' + error.stack);
         throw error;
      });
   }

   /*
   * Dans cette fonction on va chercher recursivement à savoir si l'utilisateur est repertorié les liste de l'utilisateur actuellement loggé
   * @param {object} users. Une arrays contenant tous les derniers users
   * @return {Object} this objectect is an array of rows
   */

   readUsers = function(users) {
      var deferred = $q.defer();
      var followingList = [];
      var loadUser = function (index) {
         var user = users[index];
         if (!user) {
            deferred.resolve(followingList);
            return followingList;
         }
         getTwitterInfos.get('/lists/memberships?user_id=' + user.id + '&filter_to_owned_lists=1')
         .then(function (data) {
            if(data.error) {
               deferred.resolve(followingList);
               return followingList;
            } else {
               var userArray = [];
               userArray["name"] = user.name;
               userArray["belongsToList"] =  buildKeyList(data.lists, user.screen_name);
               followingList.push(userArray);
               loadUser(++index); // recursif
            }
         })
         .catch(function (err) {
            deferred.reject(err);
         });
      }

      loadUser(0);

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

   buildKeyList = function(lists, userName) {
      var belongTo = {};
      // on remplie list_id et user_id avec les bonnes valeurs et on initialise toutes les listes existantes à false
      $scope.lists.map(function(list) {
         belongTo[list.name] = {"list_id": list.id, "user_id": userName, "init_subscribed": false, "subscribed": false};
      });
      // s'il y a match entre les lists dans lequel est l'utilisateur et toutes les lists on change la valeur de la celulle à true
      lists.map(function(list) {
         belongTo[list.name]["init_subscribed"] = true;
         belongTo[list.name]["subscribed"] = true;
      });
      return belongTo;
   }
   
   }]);