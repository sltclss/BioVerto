'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ViewSchema = new Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdBy:{
        type: Schema.ObjectId,
        ref: 'User',
        required: 'You must be logged in to create/save a view.',
    },
    createdByUsername:{
        type: String,
     //   required: 'You must be logged in to create/save a view.',
    },
    graphName: {
        type: String,
        default: '',
        required: 'The name of the attached graph is required.',
        trim: true
    },
    graphLayout: {
        type: String,
        default: 'force',
        trim: true,
    },
    title: {
        type: String,
        default: '',
        required: 'A Title is required.',
        trim: true,
    },
    summary: {
        type: String,
        required: 'A view summary is required.',
        trim: true,
    },
    state: {
        type: Object,
        required: 'Need view state'
    },
    comments: [
        {
            created: Date,
            user: String,
            text: String
        }
    ],
    notes: [
        {
            created: Date,
            user: String,
            topic: String,
            title: String,
            text: String
        }
    ],
    shareUsers: [
            String
    ]
});

mongoose.model('View', ViewSchema);