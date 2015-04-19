'use strict';

var view = require('../../app/controllers/view');

module.exports = function(app) {

    // View Routes
    app.route('/createView')
       .post(view.create);
    app.route('/getView')
        .post(view.get);
    app.route('/sharingList')
        .post(view.getShareUsers);
    app.route('/listByUser')
        .get(view.getListByUser);
    app.route('/shareView')
       .post(view.shareView);
    app.route('/shareWithMe')
       .get(view.getSharedWithUser);
    app.route('/deleteView')
        .post(view.deleteView);
    app.route('/updateView')
        .post(view.updateView);
    app.route('/addToWorkspace')
        .post(view.addToWorkspace);
    app.route('/removeFromWorkspace')
        .post(view.removeFromWorkspace);
    app.route('/getWorkspace')
        .get(view.getWorkspace);
    app.route('/getComments')
        .post(view.getComments);
    app.route('/addComment')
        .post(view.addComment);
    app.route('/deleteComment')
        .post(view.deleteComment);
    app.route('/addNote')
        .post(view.addNote);
    app.route('/getNotes')
        .post(view.getNotes);
    app.route('/deleteNote')
        .post(view.deleteNote);



}