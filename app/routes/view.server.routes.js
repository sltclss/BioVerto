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

       


}