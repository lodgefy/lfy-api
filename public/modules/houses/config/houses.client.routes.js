'use strict';

//Setting up route
angular.module('houses').config(['$stateProvider',
	function($stateProvider) {
		// Houses state routing
		$stateProvider.
		state('listHouses', {
			url: '/houses',
			templateUrl: 'modules/houses/views/list-houses.client.view.html'
		}).
		state('createHouse', {
			url: '/houses/create',
			templateUrl: 'modules/houses/views/create-house.client.view.html'
		}).
		state('viewHouse', {
			url: '/houses/:houseId',
			templateUrl: 'modules/houses/views/view-house.client.view.html'
		}).
		state('editHouse', {
			url: '/houses/:houseId/edit',
			templateUrl: 'modules/houses/views/edit-house.client.view.html'
		});
	}
]);