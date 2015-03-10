'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var houses = require('../../app/controllers/houses.server.controller');

	// Houses Routes
	app.route('/houses')
		.get(houses.list)
		.post(users.requiresLogin, houses.create);

	app.route('/houses/:houseId')
		.get(houses.read)
		.put(users.requiresLogin, houses.hasAuthorization, houses.update)
		.delete(users.requiresLogin, houses.hasAuthorization, houses.delete);

	// Finish by binding the House middleware
	app.param('houseId', houses.houseByID);
};
