'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Occurrence = mongoose.model('Occurrence'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, occurrence;

/**
 * Occurrence routes tests
 */
describe('Occurrence CRUD tests', function() {
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

		// Save a user to the test db and create new Occurrence
		user.save(function() {
			occurrence = {
				name: 'Occurrence Name'
			};

			done();
		});
	});

	it('should be able to save Occurrence instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Occurrence
				agent.post('/occurrences')
					.send(occurrence)
					.expect(200)
					.end(function(occurrenceSaveErr, occurrenceSaveRes) {
						// Handle Occurrence save error
						if (occurrenceSaveErr) done(occurrenceSaveErr);

						// Get a list of Occurrences
						agent.get('/occurrences')
							.end(function(occurrencesGetErr, occurrencesGetRes) {
								// Handle Occurrence save error
								if (occurrencesGetErr) done(occurrencesGetErr);

								// Get Occurrences list
								var occurrences = occurrencesGetRes.body;

								// Set assertions
								(occurrences[0].user._id).should.equal(userId);
								(occurrences[0].name).should.match('Occurrence Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Occurrence instance if not logged in', function(done) {
		agent.post('/occurrences')
			.send(occurrence)
			.expect(401)
			.end(function(occurrenceSaveErr, occurrenceSaveRes) {
				// Call the assertion callback
				done(occurrenceSaveErr);
			});
	});

	it('should not be able to save Occurrence instance if no name is provided', function(done) {
		// Invalidate name field
		occurrence.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Occurrence
				agent.post('/occurrences')
					.send(occurrence)
					.expect(400)
					.end(function(occurrenceSaveErr, occurrenceSaveRes) {
						// Set message assertion
						(occurrenceSaveRes.body.message).should.match('Please fill Occurrence name');
						
						// Handle Occurrence save error
						done(occurrenceSaveErr);
					});
			});
	});

	it('should be able to update Occurrence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Occurrence
				agent.post('/occurrences')
					.send(occurrence)
					.expect(200)
					.end(function(occurrenceSaveErr, occurrenceSaveRes) {
						// Handle Occurrence save error
						if (occurrenceSaveErr) done(occurrenceSaveErr);

						// Update Occurrence name
						occurrence.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Occurrence
						agent.put('/occurrences/' + occurrenceSaveRes.body._id)
							.send(occurrence)
							.expect(200)
							.end(function(occurrenceUpdateErr, occurrenceUpdateRes) {
								// Handle Occurrence update error
								if (occurrenceUpdateErr) done(occurrenceUpdateErr);

								// Set assertions
								(occurrenceUpdateRes.body._id).should.equal(occurrenceSaveRes.body._id);
								(occurrenceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Occurrences if not signed in', function(done) {
		// Create new Occurrence model instance
		var occurrenceObj = new Occurrence(occurrence);

		// Save the Occurrence
		occurrenceObj.save(function() {
			// Request Occurrences
			request(app).get('/occurrences')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Occurrence if not signed in', function(done) {
		// Create new Occurrence model instance
		var occurrenceObj = new Occurrence(occurrence);

		// Save the Occurrence
		occurrenceObj.save(function() {
			request(app).get('/occurrences/' + occurrenceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', occurrence.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Occurrence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Occurrence
				agent.post('/occurrences')
					.send(occurrence)
					.expect(200)
					.end(function(occurrenceSaveErr, occurrenceSaveRes) {
						// Handle Occurrence save error
						if (occurrenceSaveErr) done(occurrenceSaveErr);

						// Delete existing Occurrence
						agent.delete('/occurrences/' + occurrenceSaveRes.body._id)
							.send(occurrence)
							.expect(200)
							.end(function(occurrenceDeleteErr, occurrenceDeleteRes) {
								// Handle Occurrence error error
								if (occurrenceDeleteErr) done(occurrenceDeleteErr);

								// Set assertions
								(occurrenceDeleteRes.body._id).should.equal(occurrenceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Occurrence instance if not signed in', function(done) {
		// Set Occurrence user 
		occurrence.user = user;

		// Create new Occurrence model instance
		var occurrenceObj = new Occurrence(occurrence);

		// Save the Occurrence
		occurrenceObj.save(function() {
			// Try deleting Occurrence
			request(app).delete('/occurrences/' + occurrenceObj._id)
			.expect(401)
			.end(function(occurrenceDeleteErr, occurrenceDeleteRes) {
				// Set message assertion
				(occurrenceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Occurrence error error
				done(occurrenceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Occurrence.remove().exec();
		done();
	});
});