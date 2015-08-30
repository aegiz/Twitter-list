'use strict';

angular.module('twitterListApp')
.controller('TableCtrl', ['$scope', 'TableService', 'PaginationService', '$timeout', function($scope, TableService, PaginationService, $timeout) {

	$scope.cellToUpdate = [];

	/*
	* Call on every clicks of the table's checkbox.
	* Then, will update an  array cellToUpdate  with the changes to perform.
	* @param {object} infos all the info about the cell
	* @param {number} infos.list_id the id of the associated list (the x-axis)
	* @param {string} infos.user_id the id of the associated user (the y-axis)
	* @param {bool} infos.init_subscribed the state of the input on table initialization (true: checked, false: not checked)
	* @param {bool} infos.subscribed the current state of the input
	*/

	$scope.handleInputClick = function(infos) {
		if(infos.subscribed !== infos.init_subscribed) {
			infos.actionTodo = (infos.subscribed) ? "create" : "destroy";
			$scope.cellToUpdate.push({
				"nameCell": infos.user_id + "-" + infos.list_id,
				"infosCell" : infos
			});
		} else {
			// Cancel in cellToUpdate the action of creating or deleting someone
			$scope.cellToUpdate = _.filter($scope.cellToUpdate, function(el) {
				return el.nameCell !== infos.user_id + "-" + infos.list_id;
			});
		}
	};

   	/*
   	* Launch subscription / unsubscription calls. 
    * Then, clean the cellToUpdate array + update matrix and ListOfList, display ok message
   	*/

   	$scope.handleValidation = function() {
		TableService.subscribeUsers($scope.cellToUpdate).then(function() {
			// Update Matrix and ListOfList
			TableService.updateMatrix($scope.cellToUpdate);
			TableService.updateListOfList($scope.cellToUpdate);
			
			$scope.cellToUpdate = [];
			$scope.showConfirmationMsg = true;
			$timeout(function() {
				$scope.showConfirmationMsg = false;
			}, 3000);
		});
   	};

}]);