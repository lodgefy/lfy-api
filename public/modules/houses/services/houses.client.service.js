'use strict';

//Houses service used to communicate Houses REST endpoints
angular.module('houses').factory('Houses', ['$resource',
	function($resource) {
		return $resource('houses/:houseId', { houseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);