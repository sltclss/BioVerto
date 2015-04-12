'use strict';

/**
 * Modules dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	View = mongoose.model('View'),
	User = mongoose.model('User'),

	_ = require('lodash');

/**
 * Create a article
 */
exports.create = function(req, res) {
	var view = new View(req.body);

	view.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(view);
		}
	});
};


/**
 * Update a view
 */
exports.get = function(req, res) {
	
	View.findOne({_id: req.body.id}).sort('-created').exec(function(err, order){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(order);
		}
	}); 
};

/**
 * Get list of users that are being shared with
 */
exports.getShareUsers = function(req, res) {
	if(!req.user)
	{
		return res.send({
			message: 'You must be logged in.'
		});
	}
	View.findOne({createdBy: req.user._id, title: req.body.view}).sort('-created').exec(function(err, foundView){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(foundView.shareUsers)
		}
	}); 
	
};

/**
 * Get list of views that are being shared with a particular user
 */
exports.getSharedWithUser = function(req, res) {
	if(!req.user)
	{
		return res.send({
			message: 'You must be logged in.'
		});
	}
	View.find({ shareUsers: req.user.username}).sort('-created').exec(function(err, foundViews){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			foundViews.forEach(function(view){
				User.findOne({_id: view.createdBy}).sort('-created').exec(function(err, foundUser){
					if (err) 
					{
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else 
					{
						view.createdUserName = foundUser.username;
					}
				});
			});

			res.jsonp(foundViews);

			
		}
	}); 
	
};

/**
 * Share a view
 */
exports.shareView = function(req, res) {
	View.findOne({createdBy: req.user._id, title: req.body.view}).sort('-created').exec(function(err, foundView){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			foundView.shareUsers = req.body.receivers;
			foundView.save(function(err) {
				if (err) {
					return res.send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(foundView.shareUsers);
				}
			});

		}
	}); 
};

/**
 * Delete view
 */
exports.delete = function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(article);
		}
	});
};

/**
 * List of Views
 */
exports.getlist = function(req, res) {
	View.find().sort('-created').exec(function(err, views) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(views);
		}
	});
};
exports.getListByUser = function(req, res) {
	if(!req.user)
	{
		return res.send({
			message: 'You must be logged in.'
		});
	}
	View.find({createdBy: req.user._id}).sort('-created').exec(function(err, views) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(views);
		}
	});

};

