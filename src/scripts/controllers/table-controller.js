'use strict';

angular.module('twitterListApp')
   .controller('TableCtrl', ['$scope', 'getTwitterInfos', 'UserService', 'TableService' ,function($scope, getTwitterInfos, UserService, TableService) {

   $scope.cellToUpdate = [];
   $scope.UserService = UserService;
   $scope.name = UserService.name;

   // Watch of login
   $scope.$watch('UserService.name', function (newVal, oldVal) {
      if(newVal !== oldVal) {
         $scope.name = newVal;
         $scope.login = false;
         $scope.logout = true;
         TableService.initializeTableWithDatas(10, false);
      }
   });

   // Watch of datas to populate the table
   $scope.$watch(function () {
         return TableService.tableDatas;
      },                       
      function(newVal, oldVal) {
         if(newVal !== oldVal) {
            $scope.listOfLists = newVal.listOfLists;
            $scope.user = newVal.users;
            $scope.matrix = newVal.matrix;
         }
   }, true);


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
      TableService.subscribeUsers($scope.cellToUpdate).then(function(data) {
         _.each($scope.cellToUpdate, function(cell) {
            cell.monObj.init_subscribed = cell.monObj.subscribed;
         });
         $scope.cellToUpdate = [];
      });
   };

   
   
   }]);