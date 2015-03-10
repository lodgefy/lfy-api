'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Event name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	actions: [
		{
			type: {
				type: String,
				enum: ['url'],
			},
			data: {
				type: String
			}
		}
	],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Event', EventSchema);