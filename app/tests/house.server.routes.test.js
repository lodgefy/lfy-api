'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	House = mongoose.model('House'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, house;

/**
 * House routes tests
 */
describe('House CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new House
		user.save(function() {
			house = {
				name: 'House Name'
			};

			done();
		});
	});

	it('should be able to save House instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new House
				agent.post('/houses')
					.send(house)
					.expect(200)
					.end(function(houseSaveErr, houseSaveRes) {
						// Handle House save error
						if (houseSaveErr) done(houseSaveErr);

						// Get a list of Houses
						agent.get('/houses')
							.end(function(housesGetErr, housesGetRes) {
								// Handle House save error
								if (housesGetErr) done(housesGetErr);

								// Get Houses list
								var houses = housesGetRes.body;

								// Set assertions
								(houses[0].user._id).should.equal(userId);
								(houses[0].name).should.match('House Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save House instance if not logged in', function(done) {
		agent.post('/houses')
			.send(house)
			.expect(401)
			.end(function(houseSaveErr, houseSaveRes) {
				// Call the assertion callback
				done(houseSaveErr);
			});
	});

	it('should not be able to save House instance if no name is provided', function(done) {
		// Invalidate name field
		house.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new House
				agent.post('/houses')
					.send(house)
					.expect(400)
					.end(function(houseSaveErr, houseSaveRes) {
						// Set message assertion
						(houseSaveRes.body.message).should.match('Please fill House name');
						
						// Handle House save error
						done(houseSaveErr);
					});
			});
	});

	it('should be able to update House instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new House
				agent.post('/houses')
					.send(house)
					.expect(200)
					.end(function(houseSaveErr, houseSaveRes) {
						// Handle House save error
						if (houseSaveErr) done(houseSaveErr);

						// Update House name
						house.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing House
						agent.put('/houses/' + houseSaveRes.body._id)
							.send(house)
							.expect(200)
							.end(function(houseUpdateErr, houseUpdateRes) {
								// Handle House update error
								if (houseUpdateErr) done(houseUpdateErr);

								// Set assertions
								(houseUpdateRes.body._id).should.equal(houseSaveRes.body._id);
								(houseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Houses if not signed in', function(done) {
		// Create new House model instance
		var houseObj = new House(house);

		// Save the House
		houseObj.save(function() {
			// Request Houses
			request(app).get('/houses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single House if not signed in', function(done) {
		// Create new House model instance
		var houseObj = new House(house);

		// Save the House
		houseObj.save(function() {
			request(app).get('/houses/' + houseObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', house.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete House instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new House
				agent.post('/houses')
					.send(house)
					.expect(200)
					.end(function(houseSaveErr, houseSaveRes) {
						// Handle House save error
						if (houseSaveErr) done(houseSaveErr);

						// Delete existing House
						agent.delete('/houses/' + houseSaveRes.body._id)
							.send(house)
							.expect(200)
							.end(function(houseDeleteErr, houseDeleteRes) {
								// Handle House error error
								if (houseDeleteErr) done(houseDeleteErr);

								// Set assertions
								(houseDeleteRes.body._id).should.equal(houseSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete House instance if not signed in', function(done) {
		// Set House user 
		house.user = user;

		// Create new House model instance
		var houseObj = new House(house);

		// Save the House
		houseObj.save(function() {
			// Try deleting House
			request(app).delete('/houses/' + houseObj._id)
			.expect(401)
			.end(function(houseDeleteErr, houseDeleteRes) {
				// Set message assertion
				(houseDeleteRes.body.message).should.match('User is not logged in');

				// Handle House error error
				done(houseDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		House.remove().exec();
		done();
	});
});