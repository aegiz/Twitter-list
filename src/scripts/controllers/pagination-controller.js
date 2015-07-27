'use strict';

angular.module('twitterListApp')
   .controller('PaginationCtrl', ['$filter', '$scope', function($filter, $scope) {
      	// init

      	$scope.itemsTEST = [
		  {
		    "name": "Ciainid",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 3339889653,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 3339889653,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 3339889653,
		        "init_subscribed": true,
		        "subscribed": true
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 3339889653,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 3339889653,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 3339889653,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 3339889653,
		        "init_subscribed": true,
		        "subscribed": true
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 3339889653,
		        "init_subscribed": false,
		        "subscribed": false
		      }
		    }
		  },
		  {
		    "name": "rlacombe",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 138999682,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 138999682,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 138999682,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 138999682,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 138999682,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 138999682,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 138999682,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 138999682,
		        "init_subscribed": true,
		        "subscribed": true
		      }
		    }
		  },
		  {
		    "name": "ad_huko",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 2295603371,
		        "init_subscribed": true,
		        "subscribed": true
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 2295603371,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 2295603371,
		        "init_subscribed": true,
		        "subscribed": true
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 2295603371,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 2295603371,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 2295603371,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 2295603371,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 2295603371,
		        "init_subscribed": false,
		        "subscribed": false
		      }
		    }
		  },
		  {
		    "name": "Axeau_Gazel",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 515303189,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 515303189,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 515303189,
		        "init_subscribed": true,
		        "subscribed": true
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 515303189,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 515303189,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 515303189,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 515303189,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 515303189,
		        "init_subscribed": false,
		        "subscribed": false
		      }
		    }
		  },
		  {
		    "name": "hadrienl",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 15848481,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 15848481,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 15848481,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 15848481,
		        "init_subscribed": true,
		        "subscribed": true
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 15848481,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 15848481,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 15848481,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 15848481,
		        "init_subscribed": false,
		        "subscribed": false
		      }
		    }
		  },
		  {
		    "name": "NascImpact",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 59520230,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 59520230,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 59520230,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 59520230,
		        "init_subscribed": true,
		        "subscribed": true
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 59520230,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 59520230,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 59520230,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 59520230,
		        "init_subscribed": false,
		        "subscribed": false
		      }
		    }
		  },
		  {
		    "name": "CuteOverloads",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 70009161,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 70009161,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 70009161,
		        "init_subscribed": true,
		        "subscribed": true
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 70009161,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 70009161,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 70009161,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 70009161,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 70009161,
		        "init_subscribed": false,
		        "subscribed": false
		      }
		    }
		  },
		  {
		    "name": "Turblog",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 122731356,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 122731356,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 122731356,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 122731356,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 122731356,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 122731356,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 122731356,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 122731356,
		        "init_subscribed": true,
		        "subscribed": true
		      }
		    }
		  },
		  {
		    "name": "ldetilly",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 287947509,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 287947509,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 287947509,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 287947509,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 287947509,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 287947509,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 287947509,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 287947509,
		        "init_subscribed": true,
		        "subscribed": true
		      }
		    }
		  },
		  {
		    "name": "FundShop1",
		    "belongsToList": {
		      "actualités-presse": {
		        "list_id": 51611533,
		        "user_id": 1588061504,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "actualités-tech": {
		        "list_id": 19561215,
		        "user_id": 1588061504,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "autres-inclassable": {
		        "list_id": 51612970,
		        "user_id": 1588061504,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "dev-web-frontend": {
		        "list_id": 96884368,
		        "user_id": 1588061504,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "graphisme-design-art": {
		        "list_id": 19561165,
		        "user_id": 1588061504,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "les-incontournables": {
		        "list_id": 52655153,
		        "user_id": 1588061504,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "my-audience": {
		        "list_id": 211955399,
		        "user_id": 1588061504,
		        "init_subscribed": false,
		        "subscribed": false
		      },
		      "startup-entrepreneurs": {
		        "list_id": 94087326,
		        "user_id": 1588061504,
		        "init_subscribed": true,
		        "subscribed": true
		      }
		    }
		  }
		];

		$scope.listOfListTest = [
			{
				"name": "actualités-presse"
			},
			{
				"name": "actualités-tech"
			},
			{
				"name": "autres-inclassable"
			},
			{
				"name": "dev-web-frontend"
			},
			{
				"name": "graphisme-design-art"
			},
			{
				"name": "les-incontournables"
			},
			{
				"name": "my-audience"
			},
			{
				"name": "startup-entrepreneurs"
			},
		];

	    $scope.reverse = false;
	    $scope.filteredItems = [];
	    $scope.groupedItems = [];
	    $scope.itemsPerPage = 5;
	    $scope.pagedItems = [];
	    $scope.currentPage = 0;

	    var searchMatch = function (haystack, needle) {
	        if (!needle) {
	            return true;
	        }
	        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
	    };

	    // init the filtered items
	    $scope.search = function () {
	        $scope.filteredItems = $filter('filter')($scope.itemsTEST, function (item) {
	            if (searchMatch(item.name, $scope.query)){
                    return true;
                }
	            return false;
	        });
	        $scope.currentPage = 0;
	        // now group by pages
	        $scope.groupToPages();
	    };
	    
	    // calculate page in place
	    $scope.groupToPages = function () {
	        $scope.pagedItems = [];
	        
	        for (var i = 0; i < $scope.filteredItems.length; i++) {
	            if (i % $scope.itemsPerPage === 0) {
	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
	            } else {
	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
	            }
	        }
	    };
	    
	    $scope.range = function (start, end) {
	        var ret = [];
	        if (!end) {
	            end = start;
	            start = 0;
	        }
	        for (var i = start; i < end; i++) {
	            ret.push(i);
	        }
	        return ret;
	    };
	    
	    $scope.prevPage = function () {
	        if ($scope.currentPage > 0) {
	            $scope.currentPage--;
	        }
	    };
	    
	    $scope.nextPage = function () {
	        if ($scope.currentPage < $scope.pagedItems.length - 1) {
	            $scope.currentPage++;
	        }
	    };
	    
	    $scope.setPage = function () {
	        $scope.currentPage = this.n;
	    };

	    // functions have been describe process the data for display
	    $scope.search();

}]);