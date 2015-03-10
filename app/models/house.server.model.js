'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * House Schema
 */
var HouseSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill House name',
		trim: true
	},
	room: [{
		name: {
			type: String,
			default: '',
			required: 'Please fill Room name',
			trim: true
		},
		floor: {
			type: Number,
			default: 1
		},
		occurrences: [
			{
				type: Schema.ObjectId,
				ref: 'occurence'
			}
		]
	}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('House', HouseSchema);