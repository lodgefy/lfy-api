'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Occurrence Schema
 */
var OccurrenceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Occurrence name',
		trim: true
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
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Occurrence', OccurrenceSchema);