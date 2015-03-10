'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	House = mongoose.model('House'),
	_ = require('lodash');

/**
 * Create a House
 */
exports.create = function(req, res) {
	var house = new House(req.body);
	house.user = req.user;

	house.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(house);
		}
	});
};

/**
 * Show the current House
 */
exports.read = function(req, res) {
	res.jsonp(req.house);
};

/**
 * Update a House
 */
exports.update = function(req, res) {
	var house = req.house ;

	house = _.extend(house , req.body);

	house.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(house);
		}
	});
};

/**
 * Delete an House
 */
exports.delete = function(req, res) {
	var house = req.house ;

	house.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(house);
		}
	});
};

/**
 * List of Houses
 */
exports.list = function(req, res) { 
	House.find().sort('-created').populate('user', 'displayName').exec(function(err, houses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(houses);
		}
	});
};

/**
 * House middleware
 */
exports.houseByID = function(req, res, next, id) { 
	House.findById(id).populate('user', 'displayName').exec(function(err, house) {
		if (err) return next(err);
		if (! house) return next(new Error('Failed to load House ' + id));
		req.house = house ;
		next();
	});
};

/**
 * House authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.house.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
