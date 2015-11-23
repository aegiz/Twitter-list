/* Credits: https://github.com/cornflourblue/angu-fixed-header-table */
angular.module('twitterListApp')
	.directive('fixedHeader', ['$timeout', function($timeout) {
		return {
			restrict: 'A',
			link: link
		};

		function link($scope, $elem, $attrs, $ctrl) {
			var elem = $elem[0];

			// wait for data to load and then transform the table
			$scope.$watch(tableDataLoaded, function(isTableDataLoaded) {
				if (isTableDataLoaded) {
					transformTable();
				}
			});

			function tableDataLoaded() {
				// first cell in the tbody exists when data is loaded but doesn't have a width
				// until after the table is transformed
				var firstCell = elem.querySelector('tbody tr:first-child td:first-child');
				return firstCell && !firstCell.style.width;
			}
			function transformTable() {
				// reset display styles so column widths are correct when measured below
				angular.element(elem.querySelectorAll('thead, tbody')).css('display', '');
				// wrap in $timeout to give table a chance to finish rendering
				$timeout(function () {

					var tbody = elem.querySelector('tbody');
					var scrollBarWidth = tbody.offsetWidth - tbody.clientWidth;

					// set css styles on thead and tbody

					angular.element(elem.querySelectorAll('thead')).css('width', tbody.offsetWidth);
					angular.element(elem.querySelectorAll('tbody')).css('width', tbody.offsetWidth);
					angular.element(elem.querySelectorAll('thead')).css('display', 'block');
					angular.element(elem.querySelectorAll('tbody')).css({
							'display': 'block',
							'height': "70vh" || 'inherit',
							'overflow': 'auto'
					});

					var columnNb = elem.querySelectorAll('tr:first-child th').length - 1;
					var columnWidth = (elem.querySelector('tbody').offsetWidth - 220) / columnNb;

					// set widths of columns
					angular.forEach(elem.querySelectorAll('tr:first-child th'), function (thElem, i) {
						var tdElems = elem.querySelector('tbody tr:first-child td:nth-child(' + (i + 1) + ')');
						if (tdElems) {
							tdElems.style.width = (i==0 ? '220px' : columnWidth + 'px');
						}
						if (thElem) {
							thElem.style.width = (i==0 ? '220px' : columnWidth + 'px');
						}
					});

					// reduce width of last column by width of scrollbar
					
					/*if (scrollBarWidth > 0) {
						// for some reason trimming the width by 2px lines everything up better
						scrollBarWidth -= 2;
						var lastColumn = elem.querySelector('tbody tr:first-child td:last-child');
						lastColumn.style.width = (lastColumn.offsetWidth - scrollBarWidth) + 'px';
					}*/
				});
			}
		}
	}]);