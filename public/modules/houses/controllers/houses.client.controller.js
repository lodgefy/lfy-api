'use strict';

// Houses controller
angular.module('houses').controller('HousesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Houses',
	function($scope, $stateParams, $location, Authentication, Houses) {
		$scope.authentication = Authentication;

		// Create new House
		$scope.create = function() {
			// Create new House object
			var house = new Houses ({
				name: this.name
			});

			// Redirect after save
			house.$save(function(response) {
				$location.path('houses/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing House
		$scope.remove = function(house) {
			if ( house ) { 
				house.$remove();

				for (var i in $scope.houses) {
					if ($scope.houses [i] === house) {
						$scope.houses.splice(i, 1);
					}
				}
			} else {
				$scope.house.$remove(function() {
					$location.path('houses');
				});
			}
		};

		// Update existing House
		$scope.update = function() {
			var house = $scope.house;

			house.$update(function() {
				$location.path('houses/' + house._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Houses
		$scope.find = function() {
			$scope.houses = Houses.query();
		};

		// Find existing House
		$scope.findOne = function() {
			$scope.house = Houses.get({ 
				houseId: $stateParams.houseId
			});
		};
	}
]);