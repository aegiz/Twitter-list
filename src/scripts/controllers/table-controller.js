'use strict';

angular.module('twitterListApp')
   .controller('TableCtrl', ['$log', '$scope', 'getTwitterInfos' , '$q', 'Auth', 'User', function($log, $scope, getTwitterInfos, $q, Auth, User) {
   
   $scope.lists = [];
   $scope.matrix = [];
   $scope.cellToUpdate = [];

   $scope.User = User;
   $scope.name = User.name;

   $scope.$watch('User.name', function (newVal, oldVal) {
      if(newVal !== oldVal) {
         $scope.name = newVal;
         $scope.login = false;
         $scope.logout = true;
         //$scope.initializeTableWithDatas(10);
         $scope.testOnlyNoList();
      }
   });

   /*
   * Recupère le clic sur les input
   * Va ensuite repertorier dans une array cellToUpdate les changements a executer.
   * @param {object} infos toutes les infos à propos de ce champs input
   * @param {number} infos.list_id l'id de la liste associé (en abscisses)
   * @param {string} infos.user_id le nom de l'utilisateur associé (en ordonnées)
   * @param {bool} infos.init_subscribed l'état de l'input à l'origine (true: clicked, false: not clicked)
   * @param {bool} infos.subscribed l'etat de l'input actuellement
   */

   $scope.handleInputClick = function(infos) {
      if(infos.subscribed !== infos.init_subscribed) {
         $scope.cellToUpdate.push({
            "name": infos.user_id + "-" + infos.list_id,
            "monObj" : infos,
            "actionTodo": (infos.subscribed) ? "create" : "destroy"
         });         
      } else {
         // Remove sur l'element une action
         $scope.cellToUpdate = _.filter($scope.cellToUpdate, function(el) {
            return el.name !== infos.user_id + "-" + infos.list_id;
         });
      }
   };

   /*
   * Valide et souscrit les utilisateurs aux nouvelles listes.
   * Dans le callback on reinitialise la valeur initiale des input 
   * (Pour cela on utilise les données du tableau newListToSubscribeTo)
   */

   $scope.handleValidation = function() {
      subscribeUsers($scope.cellToUpdate).then(function(data) {
         _.each($scope.cellToUpdate, function(cell) {
            cell.monObj.init_subscribed = cell.monObj.subscribed;
         });
         $scope.cellToUpdate = [];
      });
   };

   /*
   * Recupère les datas à afficher dans le tableau
   * @param {number} xFlw. Le nombre de following à afficher
   */

   $scope.initializeTableWithDatas = function(xFlw) {
      // First step : on récupère toutes les listes créé par notre utilisateur
      getTwitterInfos.get('/lists/ownerships').then(function(data) {
         // Deuxième étape: on va récupérer toutes les personnes dans ces listes
         getUsersInLists(data.lists).then(function(data) {
            $scope.listOfLists = _.sortBy(data, function (obj) {return obj.name;});
            // Troisième étape : on récupére les xFlw dernières personnes suivies par notre utilisateur
            getTwitterInfos.get('/friends/list?count=' + xFlw).then(function(data) {
               $scope.users = data.users;
               // Quatrième étape : on compare et on trie
               $scope.matrix = buildKeyList();
            });
         });
      }, function (error) {
         console.error('handle error: ' + error.stack);
         throw error;
      });
   };

   /*
   * Recupère les datas à afficher dans le tableau
   * @param {number} xFlw. Le nombre de following à afficher
   */

   $scope.testOnlyNoList = function() {
      // First step : on récupère toutes les listes créé par notre utilisateur
      getTwitterInfos.get('/lists/ownerships').then(function(data) {
         // Deuxième étape: on va récupérer toutes les personnes dans ces listes
         getUsersInLists(data.lists).then(function(data) {
            $scope.listOfLists = _.sortBy(data, function (obj) {return obj.name;});
            // Troisième étape : on récupére les 5000 derniere personnes que follow notre user
            getTwitterInfos.get('/friends/ids?count=150').then(function(data) {
               // Quatrième étape : on score chaque user avec le nombre de lsite dans lequel il est
               var scoreList = buildScoreList(data.ids);
               //Ensuite on trie le tableau en ne récupérant que ceux qui ont un score de 0
               var scoreListW0 = _.filter(scoreList, function(list) {
                   return list.score === 0;
               });
               $scope.matrix = buildKeyList2(scoreListW0);
            });
         });
      }, function (error) {
         console.error('handle error: ' + error.stack);
         throw error;
      });
   };

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
   * Lance tous les calls de subsciption/unsubscription sur les différents users
   */

   function subscribeUsers(items) {
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

   /*
   * Got more infos on user
   */

   function moreInfosUsers(items) {
      var deferred = $q.defer();
      var listOfUsers = [];

      var subscribe = function (index) {

         var item = items[index];
         if (!item) {
            deferred.resolve(listOfUsers);
            return listOfUsers;
         }
         getTwitterInfos.get('/users/lookup?user_id=' + item.id)
         .then(function (data) {
            listOfUsers.push({screen_name: data[0].screen_name, id: data[0].id});
            subscribe(++index); // recursif
         })
         .catch(function (err) {
            deferred.reject(err);
         });
      };

      subscribe(0);
      return deferred.promise;
   }

   /*
   * Retourne un object contenant toutes les infos pour une cellule
   * @return {Object} belongTo : une arrray des lists dans lequel est présent le user + l'id du user et l'id de la liste
   */

   function buildKeyList() {
      var followingList = [];
      _.each($scope.users, function(userRow) {
         var belongsToList = {};
         var userInfos = {};
         userInfos.name = userRow.screen_name;
         _.each($scope.listOfLists, function(list) {
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
   * L'idée : pour chaque ids de personne suivi on va établir un score de nombre de listes dans lequel il est présent
   */

   function buildScoreList(ids) {
      var score = [];
      
      _.each(ids, function(id) {
         var infoUser = {
            "id": id,
            "score": 0
         };
         _.each($scope.listOfLists, function(list) {
            if(_.filter(list.users, function(user) {
                  return user.id === id;
               }).length !== 0) {
               infoUser.score ++;
            }
         });
         score.push(infoUser);
      });
      return score;
   }

   /*
   * ... Ensuite pour chaque user avec un score de 0 on va faire https://dev.twitter.com/rest/reference/get/users/lookup
   * pour obtenir plus d'infos sur l'user en question
   */

   function buildKeyList2(users) {

     var followingList = [];

      moreInfosUsers(users).then(function(userWOList) {
         _.each(userWOList, function(userRow) {
            var belongsToList = {};
            var userInfos = {};
            userInfos.name = userRow.screen_name;
            userInfos.id = userRow.id;
            _.each($scope.listOfLists, function(list) {
               belongsToList[list.name] = {
                  "list_id": list.id,
                  "user_id": userRow.id,
                  "init_subscribed": false,
                  "subscribed": false,
               };
            });
            userInfos.belongsToList = belongsToList;
            followingList.push(userInfos);
         });
      });
      return followingList;
   }
   
   }]);