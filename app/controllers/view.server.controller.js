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
 * Create a view
 */
exports.create = function(req, res) {
	var view = new View(req.body);
	view.createdBy = req.user._id;
	console.log(req.body);
	view.state = req.body.state;
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
 exports.updateView = function(req, res) {
	if(!req.body.viewId || !req.body.state)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}	

	View.update({_id: req.body.viewId}, {$set: { state: req.body.state }}).sort('-created').exec(function(err, result){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(result);
		}
	}); 
};

/**
 * Get a view
 */
exports.get = function(req, res) {
	if(!req.body.id)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}	
	View.findOne({_id: req.body.id}).sort('-created').exec(function(err, view){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(view);
		}
	}); 
};
/**
 * Get Workspace
 */
 exports.getWorkspace = function(req, res) {
	if(!req.user)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}	
	User.findOne({_id: req.user.id}).sort('-created').exec(function(err, user){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(user.workspaceViews);
		}
	}); 
};
/**
 * Add to Workspace
 */
exports.addToWorkspace = function (req, res)
{
	if(!req.user || !req.body.viewId)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}	
	User.update({_id: req.user._id}, {$addToSet: { workspaceViews: req.body.viewId }}).sort('-created').exec(function(err, user){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
		res.jsonp(user.workspaceViews);
		}
	}); 
}
/**
 * Remove from Workspace
 */
exports.removeFromWorkspace = function (req, res)
{
	if(!req.user || !req.body.viewId)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}	
	User.update({_id: req.user._id}, { $pull: { workspaceViews: req.body.viewId } }).sort('-created').exec(function(err, user){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			/*
			var index = user.workspaceViews.indexOf(req.body.viewId);

							console.log(req.body.viewId);
				console.log(user.workspaceViews);
			if(index>-1)
			{
				var results = user.workspaceViews;
				//results.splice(index, 1);
				console.log('testhere');
				//user.workspaceViews = results;
				user.save(function(err) {
					if (err) {
						return res.send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(user.workspaceViews);
						return;
					}
				});
			}
			else
			{
				res.jsonp(user.workspaceViews);
			}*/
			res.jsonp(user.workspaceViews);
		}
	}); 
}

 /**
 *  Comments
 */
 exports.getComments = function(req, res) {
	if(!req.user || !req.body._id)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}	
	View.findOne({_id: req.body._id}).sort('-created').exec(function(err, view){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(view.comments);
		}
	}); 
};
exports.addComment = function(req, res) {
	if(!req.user || !req.body.text || !req.body._id)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}

	var comment = 
	{
		created: new Date(),
		user: req.user.username,
		text: req.body.text
	};

	View.update({_id: req.body._id}, {$addToSet: { comments: comment }}).sort('-created').exec(function(err, result){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
		res.jsonp(result);
		}
	}); 
};

exports.deleteComment = function(req, res) {
	if(!req.user || !req.body.view || !req.body.comment)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}

	if(req.body.comment.user!=req.user.username)
	{
		return res.send({
			message: 'User not authorized to delete comment'
		});
	}

	View.update({_id: req.body.view}, {$pull: { comments: {_id: req.body.comment._id} }}).sort('-created').exec(function(err, result){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(result);
		}
	}); 
};
/**
 * Notes
 */

 
 exports.getNotes = function(req, res) {
	if(!req.user || !req.body._id)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}	
	View.findOne({_id: req.body._id}).sort('-created').exec(function(err, view){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(view.notes);
		}
	}); 
};
exports.addNote = function(req, res) {
	if(!req.user || !req.body.text || !req.body.title  || !req.body.topic  || !req.body._id)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}

	var note = 
	{
		created: new Date(),
		user: req.user.username,
		text: req.body.text,
		title: req.body.title,
		topic: req.body.topic
	};

	View.update({_id: req.body._id}, {$addToSet: { notes: note }}).sort('-created').exec(function(err, result){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
		res.jsonp(result);
		}
	}); 
};

exports.deleteNote = function(req, res) {
	if(!req.user || !req.body.view || !req.body.note)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}
	console.log(req.body);

	if(req.body.note.user!=req.user.username)
	{
		return res.send({
			message: 'User not authorized to delete comment'
		});
	}

	View.update({_id: req.body.view}, {$pull: { notes: {_id: req.body.note._id} }}).sort('-created').exec(function(err, result){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{

			res.jsonp(result);
		}
	}); 
};
/*
exports.editNote = function(req, res) {
	if(!req.user || !req.body.view || !req.body.note)
	{
		return res.send({
			message: 'Missing data; request incomplete'
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
			function matchNote(element, index, array) {
			  return _.isEqual(element, req.body.note);	
			}
			foundview.notes.find(matchNote);
			//add edit code

			foundView.save(function(err) {
				if (err) {
					return res.send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(foundView.note);
				}
			});			
			res.jsonp(foundView.note)
		}
	});
*/
/**
 * Get list of users that are being shared with
 */
exports.getShareUsers = function(req, res) {
	if(!req.user || !req.body.view)
	{
		return res.send({
			message: 'Missing data; request incomplete'
		});
	}
	View.findOne({_id: req.body.view}).sort('-created').exec(function(err, foundView){
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
	if(!req.user || !req.body.view)
	{
		return res.send({
			message: 'Missing data; request incomplete'
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
exports.deleteView = function(req, res) {
	View.remove({ _id: req.body.id }, function(err) {
    	if (err) {
			return res.status(400).send({
				message: 'errorHandler.getErrorMessage(err)'
			});
		} else {
			return res.send({
			message: 'View has been deleted.'
		});
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

