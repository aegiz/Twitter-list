'use strict';
// Role of this service: Alow to share these variables among the different services
angular.module('twitterListApp')
	.factory('InappService', ['$q', function($q) {
		
		/*
		* listOfLists: 
		* This array hold all the infos relative to the lists created by the connected user
		* Structure: listOfLists = [Object, Object, ...] where Object is a single list.
		* A single list has these properties: {id: ,name:, user: Array }. 
		* ... Where users is an array of users contains in the list
		* Role: listOfLists is handy when we have to calculate the score of a following (step performed during init and validation)
		*/
		
		var listOfLists = [];

		/*
		* users: 
		* A collection of all the people our connected user follow. 
		* Structure: users = [Object, Object, ...] 
		* Role: users' object help to build the matrix (step performed during init and reset of user after some clicks on the filtering)
		*/
		
		var users = [];

		/*
		* matrix: 
		* These Arrays are a copy of users' object. We just add a score and belongTolistArray. 
		* (in belongsToList we list if the current person belong to the list or not)
		* Role: these matrix are used to populate the object pagedItems with the correct datas
		*/

		var matrix = [];

		var	matrixWithoutList = [];

		var matrixWithMultiList = [];

		/*
		* currentPage: 
		* this int is dedicated to page's navigation (technically it's the index of pagedItems)
		* So when it's value change the able view is updated
		*/

		var	currentPage = 0;

		/*
		* pagedItems: 
		* This Array is build construite from matrix decomposition in sub-pages
		* Role: pagedItems is specially dedicated to display the informations on the screen
		*/

		var pagedItems = [];

		/*
		* filterInfos: 
		* Gather some informations about the tab (which on is selected, how many users in which etc.)
		*/

		var filterInfos = {};

		/*
		* clearSearch: 
		* Trigger the reset of the current search query
		*/

		var clearSearch = false;

		return {
			listOfLists: listOfLists,
			users: users,
			matrix: matrix,
			matrixWithoutList: matrixWithoutList,
			matrixWithMultiList: matrixWithMultiList,
			currentPage: currentPage,
			pagedItems: pagedItems,
			filterInfos: filterInfos,
			clearSearch: clearSearch
		};
	}]);