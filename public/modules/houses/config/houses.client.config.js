'use strict';

// Configuring the Articles module
angular.module('houses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Houses', 'houses', 'dropdown', '/houses(/create)?');
		Menus.addSubMenuItem('topbar', 'houses', 'List Houses', 'houses');
		Menus.addSubMenuItem('topbar', 'houses', 'New House', 'houses/create');
	}
]);