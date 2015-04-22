angular.module("MyApp")
        .controller('mainController', function($scope, $rootScope ,$modal, modalCtrlProvider, $http, $compile, Authentication, $timeout) {
            $scope.views =[];
            $scope.active = 0;
            $scope.newViewIndex = 0;
            $scope.bugreportDisable = false;
            $scope.imgdata;
            $scope.imgSnippet;
            $scope.test = ["a", "b", "c"]
            $scope.graphList = [];
            $scope.logged = false;
            $scope.username = null;
            $scope.selectedGrah = {};

            $scope.authentication = Authentication;
           
            $scope.randomSort = function(view) {
              return Math.random();
            };

            $scope.addView = function(layout, graphName, state, title, other)
            {   
                if ($scope.newViewIndex !== 0 && typeof graphName === 'undefined')
                {
                    graphName = $scope.views[$scope.active].graphName;
                }
                var nTitle = "New View " + $scope.newViewIndex;

                if(title)
                {
                    nTitle = title;
                }
                if(other==undefined)
                {
                    other = {};
                }
                $scope.active = $scope.newViewIndex;
                $scope.views[$scope.newViewIndex] = 
                {
                    layout: layout, 
                    title: nTitle, 
                    graphName: graphName, 
                    indx: $scope.newViewIndex, 
                    state: state, 
                    _id: other._id, 
                    comments: other.comments, 
                    notes: other.notes, 
                    createdOn: other.createdOn,
                    createdBy: other.createdBy, 
                    createdByUsername: other.createdByUsername,
                    shareUsers: other.shareUsers
                };

                $scope.newViewIndex++;
            };

            $scope.loginUser = function(username, password)
            {
                var formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);
                $http({method: 'POST', url: '/authenticate/userpass', data: formData, headers: {'Content-Type': undefined}, transformRequest: angular.identity})
                        .success(function(data, status, headers, config) {
                            //$scope.state = 'previewState';
                            $scope.loggedUser = loggedUser = data;
                            $scope.logged = logged = true;

                        });

            };

            $scope.isLoggedIn = function()
            {
                $http({method: 'POST', url: '/getUser', headers: {'Content-Type': undefined}, transformRequest: angular.identity})
                        .success(function(data, status, headers, config) {
                            console.log(data);
                            // $scope.state = 'previewState';

                        });
            };
            $scope.registerUser = function(email)
            {

                var formData = new FormData();
                formData.append('email', email);
                $http({method: 'POST', url: '/signup', data: formData, headers: {'Content-Type': undefined}, transformRequest: angular.identity})
                        .success(function(data, status, headers, config) {
                            console.log(data);
                        });

            };
            $scope.logout = function()
            {
                var formData = new FormData();

                $http({method: 'GET', url: '/logout', data: formData, headers: {'Content-Type': undefined}, transformRequest: angular.identity})
                        .success(function(data, status, headers, config) {
                            $scope.loggedUser = loggedUser = null;
                            $scope.logged = logged = false;
                        });

            };
            $scope.removeView = function(index)
            {
                // First delete this view
                $scope.removeWorkspaceStatus(index);
                //delete $scope.views[index];
                //remove undefined values
                $scope.views.splice(index,1);
                $scope.newViewIndex--;
                // Select another view to be the active view
                // Simply pick the first view available
                // This is ugly but effective. There is no API to do this
                if($scope.views.length>0)
                {
                    for (var i in $scope.views) {
                        $scope.changeView(i);
                        return; // we got the first one
                    }
                   console.log($scope.views.length);
                }
            };
            $scope.panelFn = function(fntype, args)
            {
                $scope[fntype](args);
            };
            $scope.changeView = function(indx)
            {
                $scope.active = parseInt(indx);
                $scope.updateSelectedGraph();
                //update note topics
                $scope.getNotes();


            };
            $scope.cloneView = function(state)
            {
                $scope.addView(state.layout, state.graphName, state);
            };
            
            $scope.addViewFromJson = function(stateJson)
            {
            $scope.cloneView (CircularJSON.parse(stateJson));
                
            };
            $scope.addGraphFromJson = function(graphJson,name)
            {
              var tempGraph = new Graph();
              tempGraph.resumeState( CircularJSON.parse(graphJson))
               g5.graphs[name] = tempGraph;
            };
            $scope.fileUpload = function(plugin)
            {
                $scope.fileType;
                $scope.fileData;
                $scope.fileName;
                var modalInstance = $modal.open({
                    templateUrl: './partials/' + plugin + 'FileOpen.html',
                    controller: modalCtrlProvider.getCtrl(plugin),
                });
                modalInstance.result.then(function(newGraph) {
                    if ($scope.graphList.indexOf(newGraph.graphName) === -1)
                    {
                        $scope.graphList.push(newGraph.graphName);
                    }
                    $scope.addView(newGraph.layout, newGraph.graphName);
                }, function() {

                    return;
                });
            };
            $scope.contactUs = function()
            {
                var modalInstance = $modal.open({
                    templateUrl: './partials/contactUs.html',
                    controller: modalCtrlProvider.getCtrl("contactUs"),
                });
                modalInstance.result.then(function() {

                }, function() {
                    return;
                });
            };

            $scope.reportBug = function()
            {
                $scope.bugreportDisable = true;
                $scope.alertShow = true;
                $('html,body').css('cursor', 'crosshair');
                inspectElement(document, function(e) {
                    $scope.takeImage(e);

                }, function() {
                    $scope.bugreportDisable = false;
                    $scope.alertShow = false;
                    $scope.$digest();
                    $('html,body').css('cursor', 'auto');
                })
            };
            $scope.alertClose = function()
            {
                $scope.alertShow = false;
            };

            $scope.databaseDownload = function(plugin)
            {
                var modalInstance = $modal.open({
                    templateUrl: './partials/' + plugin + 'DBOpen.html',
                    controller: modalCtrlProvider.getCtrl(plugin),
                });
                modalInstance.result.then(function(newGraph) {
                    if ($scope.graphList.indexOf(newGraph.graphName) === -1)
                    {
                        $scope.graphList.push(newGraph.graphName);
                    }
                    $scope.addView(newGraph.layout, newGraph.graphName);
                }, function() {
                    return;
                });
            };
            $scope.takeImage = function(e) {
                var svgElements = $('body').find('svg');
                svgElements.each(function() {
                    var canvas, xml;
                    canvas = document.createElement("canvas");
                    canvas.className = "screenShotTempCanvas";
                    //convert SVG into a XML string
                    xml = (new XMLSerializer()).serializeToString(this);
                    // Removing the name space as IE throws an error
                    xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
                    //draw the SVG onto a canvas
                    canvg(canvas, xml);
                    $(canvas).insertAfter(this);
                    //hide the SVG element
                    this.className = "tempHide";
                    $(this).hide();
                });
                html2canvas(document.body, {
                    onrendered: function(canvas) {

                        var ctx = canvas.getContext('2d');
                        // ctx.drawImage(pinImage, e.pageX, e.pageY);
                        console.log(e);
                        ctx.beginPath();
//                        var mouseX = e.clientX + document.body.scrollLeft;
//                        var mouseY = e.clientY + document.body.scrollTop;
                        var startingX = e.pageX, startingY = e.pageY;


                        ctx.moveTo(startingX, startingY);
                        ctx.bezierCurveTo(startingX - 16, startingY - 20, startingX + 32, startingY - 21, startingX + 17, startingY);

                        ctx.moveTo(startingX, startingY)
                        ctx.bezierCurveTo(startingX + 12, startingY + 39, startingX + 16, startingY - 8, startingX + 17, startingY);
                        ctx.closePath();
                        ctx.fillStyle = 'red';
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(startingX + 9, startingY - 5, 5, 0, 2 * Math.PI);
                        ctx.stroke();
                        ctx.fillStyle = 'black';
                        ctx.fill();
                        var img = canvas.toDataURL("image/png");
                        img = img.substr(img.indexOf(',') + 1).toString();
                        $scope.imgdata = img;

                        var snippet = document.createElement('canvas');
                        snippet.width = 200;
                        snippet.height = 200;
                        snippet.getContext('2d').drawImage(canvas, e.pageX - 100, e.pageY - 230, 400, 400, 0, 0, 200, 200);
                        $scope.imgSnippet = snippet.toDataURL("image/png");
                        $scope.bugreportDisable = false;
                        $scope.alertShow = false;
                        $scope.$digest();
                        $('html,body').css('cursor', 'auto');
                        var modalInstance = $modal.open({
                            templateUrl: './partials/feedback.html',
                            controller: modalCtrlProvider.getCtrl("feedback"),
                            resolve: {
                                img: function() {
                                    return $scope.imgSnippet;
                                }}
                        });
                        modalInstance.result.then(function(obj) {
                            $('body').find('.screenShotTempCanvas').remove();
                            $('body').find('svg').show();
                            $http.post(asanaPHPPath, {imgdata: $scope.imgdata, name: obj.name, email: obj.eid, detail: obj.detail});

                        }, function() {
                            $('body').find('.screenShotTempCanvas').remove();
                            $('body').find('svg').show();

                            return;
                        });
                    }
                }
                );
            };


//SLT
            $scope.loginContact = function(number)
            {
                if($scope.authentication.user!=undefined && number<2)
                {
                    return;
                }
                var modalInstance = $modal.open({
                    templateUrl: './partials/loginContactModal.html',
                    controller: modalCtrlProvider.getCtrl("loginContact"),
                    windowClass: 'login-modal',
                    resolve: {
                        tabNum: function() {
                            return number;   
                        }
                    },
                });
                modalInstance.result.then(function() {

                }, function() {
                    return;
                });
            };

            $scope.shareView = function(callFrom, view)
            {
                var modalInstance = $modal.open({
                    templateUrl: './partials/shareViewOpen.html',
                    controller: modalCtrlProvider.getCtrl("shareView"),
                    resolve: {
                        view: function() {
                            if(callFrom=='my-views')
                            {
                                return view;
                            }
                            return $scope.views[$scope.active];
                        }}
                });
                 modalInstance.result.then(function(response) {
                    if(response.isChanged && callFrom=='my-views')
                    {
                        view.shareUsers=response.updatedList;
                        for(var i = 0; i<$scope.views.length; i++)
                        {
                            if($scope.views[i]._id==view._id)
                            {
                                $scope.views[i].shareUsers = response.updatedList;
                                break;
                            }
                        }
                    }
                    else
                    {
                        $scope.views[$scope.active].shareUsers=response.updatedList;
                    }
                }, function() {
                    return;
                });
            };
            $scope.saveView = function(state)
            {  
                if($scope.views[$scope.active]._id!=undefined)
                {

                    $http.post('/updateView', {viewId: $scope.views[$scope.active]._id, state: state}).success(function(response) {
                    }).error(function(response) {
                        $scope.error = response.message;
                    });
            }
                else
                {
                    var nView = $scope.views[$scope.active];
                    nView.state = state;
                    var modalInstance = $modal.open({
                        templateUrl: './partials/saveViewOpen.html',
                        controller: modalCtrlProvider.getCtrl("saveViewCtrl"),
                        resolve: {
                            view: function() {
                                return nView;
                            }}
                    });
                     modalInstance.result.then(function(view) {
                        view.inWorkspace=true;
                        view.layout = $scope.views[$scope.active].layout;
                        view.indx = $scope.views[$scope.active].indx;
                        $scope.views[$scope.active].title = view.title;
                        $scope.views[$scope.active] = view;
                        $scope.myViews.push(view);

                        $http.post('/addtoWorkspace', {viewId: view._id}).success(function(response2) {
                            $scope.workspaceViewIds = response2;
                        }).error(function(response2) {
                            $scope.error = response2.message;
                        });

                    }, function() {
                        return;
                    });
             }
            /*    
            var graphJson = CircularJSON.stringify(g5.graphs[state.graphName].getState());
                var viewJson = CircularJSON.stringify(state);
                var send =
                {
                   graphJson: CircularJSON.stringify(g5.graphs[state.graphName].getState()),
                   viewJson: CircularJSON.stringify(state),
                   viewState: state
                }
            */
            };
            $scope.addToWorkspace = function(type, index)
            {
                var selectedView = {};
                if(type=='myView')
                {
                    selectedView = $scope.myViews[index];
                }
                else if(type=='sharedView')
                {
                    selectedView = $scope.sharedViews[index];
                }
                    var state = selectedView.state;
                    console.log(selectedView);
                    var other =
                    {
                        _id: selectedView._id, 
                        comments: selectedView.comments, 
                        notes: selectedView.notes, 
                        createdBy: selectedView.createdBy,
                        createdOn: selectedView.createdOn,
                        createdByUsername: selectedView.createdByUsername,
                        shareUsers: selectedView.shareUsers
                    };
                    $scope.addView(state.layout, state.graphName, state, selectedView.title, other);

                    selectedView.inWorkspace=true;
                    $http.post('/addtoWorkspace', {viewId: selectedView._id}).success(function(response) {
                        $scope.workspaceViewIds = response;
                    }).error(function(response) {
                        $scope.error = response.message;
                    });
            };
            $scope.removeWorkspaceStatus = function(index)
            {
                for(var i = 0; i< $scope.myViews.length; i++)
                {
                    if($scope.myViews[i]._id==$scope.views[index]._id)
                    {
                        $scope.myViews[i].inWorkspace = false;
                        $http.post('/removeFromWorkspace', {viewId: $scope.myViews[i]._id}).success(function(response) {
                             $scope.workspaceViewIds = response;
                        }).error(function(response) {
                            $scope.error = response.message;
                        });
                    }
                }
                for(var i = 0; i< $scope.sharedViews.length; i++)
                {
                    console.log($scope.sharedViews[i]._id);
                    console.log($scope.views[index]._id);
                    console.log($scope.sharedViews[i]._id==$scope.views[index]._id);
                    if($scope.sharedViews[i]._id==$scope.views[index]._id)
                    {                        
                        $scope.sharedViews[i].inWorkspace = false;
                        $http.post('/removeFromWorkspace', {viewId: $scope.sharedViews[i]._id}).success(function(response) {
                            console.log('removed from database:');
                            console.log(response);
                        }).error(function(response) {
                            $scope.error = response.message;
                        });
                    }
                }
            };
            $scope.workspaceViewIds = {};
            $scope.workspaceLoading = true;
            $scope.setupWorkspace = function()
            {

                $http.get('/getWorkspace').success(function(response) {
                    
                    $scope.workspaceViewIds = response;
                    $scope.workspaceLoading = false;
                    $scope.workspaceViewIds.forEach(function(viewId){
                        for(var i = 0; i< $scope.myViews.length; i++)
                        {
                            if($scope.myViews[i]._id == viewId )
                            {
                               var state = $scope.myViews[i].state;
                               var other =
                                {
                                    _id: $scope.myViews[i]._id, 
                                    comments: $scope.myViews[i].comments, 
                                    notes: $scope.myViews[i].notes, 
                                    createdBy: $scope.myViews[i].createdBy,
                                    createdOn: $scope.myViews[i].createdOn,
                                    createdByUsername: $scope.myViews[i].createdByUsername,
                                    shareUsers: $scope.myViews[i].shareUsers
                                };
                                $scope.addView(state.layout, state.graphName, state, $scope.myViews[i].title, other);

                                $scope.myViews[i].inWorkspace=true;
                                return;
                            }
                        }
                        for(var i = 0; i< $scope.sharedViews.length; i++)
                        {
                            if($scope.sharedViews[i]._id == viewId )
                            {                        
                                var state = $scope.sharedViews[i].state;
                                var other =
                                {
                                    _id: $scope.sharedViews[i]._id, 
                                    comments: $scope.sharedViews[i].comments, 
                                    notes: $scope.sharedViews[i].notes, 
                                    createdBy: $scope.sharedViews[i].createdBy,
                                    createdOn: $scope.sharedViews[i].createdOn,
                                    createdByUsername: $scope.sharedViews[i].createdByUsername,
                                    shareUsers: $scope.sharedViews[i].shareUsers
                                };
                                $scope.addView(state.layout, state.graphName, state, $scope.sharedViews[i].title,  other);

                                $scope.sharedViews[i].inWorkspace=true;
                                return;
                            }
                        }        
                    });
                }).error(function(response) {
                    $scope.error = response.message;
                });

            }
            $scope.myViews = [];
            $scope.userGraphNames = [];
            $scope.userGraphs = [];
            $scope.getMyViews = function()
            {
                $http.get('/listByUser').success(function(response) {
                    $scope.myViews=response;
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };
            $scope.updateSelectedGraph = function()
            {
                for(var i = 0; i<$scope.userGraphs.length; i ++)
                {
                    if($scope.userGraphs[i].title==$scope.views[$scope.active].graphName)
                    {
                        $scope.selectedGraph = $scope.userGraphs[i];
                        break;
                    }
                }
            };
            $scope.initViewGraphs = function()
            {   
                $http.get('/listByUser').success(function(response) {
                    $scope.myViews=response;
                    for(var i = 0; i<$scope.myViews.length; i++)
                    {                       
                        if($scope.userGraphNames.indexOf($scope.myViews[i].graphName)<0)
                            {
                                $scope.userGraphNames.push($scope.myViews[i].graphName);
                            }
                    }
                    $http.get('/shareWithMe').success(function(response1) {
                        $scope.sharedViews=response1;
                        for(var i = 0; i<$scope.sharedViews.length; i++)
                        {                       
                            if($scope.userGraphNames.indexOf($scope.sharedViews[i].graphName)<0)
                            {
                                $scope.userGraphNames.push($scope.sharedViews[i].graphName);
                            }
                        }
                        if($scope.userGraphNames.length>0)
                        {                            

                            $scope.retrieveGraphs($scope.userGraphNames);
                        }
                    }).error(function(response) {
                        $scope.error = response.message;
                    });
                }).error(function(response) {
                    $scope.error = response.message;
                });

                    //after initialize setup workspace; time out for asynchronous calls
                     $timeout($scope.setupWorkspace, 900);

            };

            $scope.retrieveGraphs = function(graphNames)
            {   
                var send = {userGraphs: graphNames};
                $http.post('/userGraphs', send).success(function(response) {
                    $scope.userGraphs = response;
                    for(var i = 0; i<$scope.userGraphs.length; i++)
                    {
                        if(g5.getGraph($scope.userGraphs[i].title)==undefined)
                        {
                            $scope.loadWorkspaceGraph($scope.userGraphs[i]);
                        }
                    }

                }).error(function(response) {
                    $scope.error = response.message;
                });  
            }
            $scope.loadWorkspaceGraph = function(graph)
            {   $http.get("/getDb",{responseType: "arraybuffer",params:{dbFile:graph.dbFile,title:graph.title}}).success(function(result) {
                    var blob = new Uint8Array(result);
                    var   db = new GraphSqliteDb(new SQL.Database(blob));
                    g5.loadGraph(graph,db,graph.title);
                });
            };

            $scope.sharedViews = [];
            $scope.getSharedViews = function()
            {
                $http.get('/shareWithMe').success(function(response) {
                    $scope.sharedViews=response;

                }).error(function(response) {
                    $scope.error = response.message;
                });
            };

            $scope.updateSharedViews = function()
            {
                $http.get('/shareWithMe').success(function(response) {
                    response.forEach(function (view)
                    {
                        var exists  = false;
                        for(var i = 0; i<$scope.sharedViews.length; i++)
                        {
                            if(view._id ==$scope.sharedViews[i]._id)
                            {
                                exists = true;
                                break;
                            }
                        }
                        if(!exists)
                        {console.log(view.graphName);
  
                                $scope.retrieveGraphs([view.graphName]);

                            $scope.sharedViews.push(view);
                        }
                    });
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };
            $scope.showTopic={};
            $scope.deleteView = function(view)
            {
                var modalInstance = $modal.open({
                    templateUrl: './partials/deleteViewOpen.html',
                    controller: modalCtrlProvider.getCtrl("deleteViewCtrl"),
                    resolve: {
                        view: function() {
                        return view;
                    }}
                });
                modalInstance.result.then(function(proceed) {
                    if(proceed)
                    {
                        var rView = view;
                        var send =
                        {
                            id: rView._id
                        };
                        $http.post('/deleteView', send).success(function(response) {
                            var j = 0;
                            for(j; j<$scope.myViews.length;j++)
                            {
                                if($scope.myViews[j]._id==view._id)
                                break;
                            }
                            $scope.myViews.splice(j,1);
                        }).error(function(response) {
                            $scope.error = response.message;
                        });
                        $http.post('/removeFromWorkspace', {viewId: view._id}).success(function(response) {
                             $scope.workspaceViewIds = response;
                        }).error(function(response) {
                            $scope.error = response.message;
                        });
                        var i = 0;
                        for(i; i<$scope.views.length; i++)
                        {
                            if($scope.views[i]._id==rView._id)
                            {
                                break;
                            }
                        };
                        $scope.removeView(i);
                    }
                }, function() {
                    return;
                });
            };

        /*
        * Comments
        */ 
            $scope.getComments = function()
            {
                $http.post('/getComments', {_id:  $scope.views[$scope.active]._id }).success(function(response) {
                    $scope.views[$scope.active].comments = response;
                }).error(function(response) {
                    $scope.error = response.message;
                });
            } 
            $scope.newComment = {};
            $scope.addComment = function()
            {  if($scope.newComment.text.length==0 || $scope.newComment.text.length==undefined)
                {
                    console.log('Too short');
                    return;
                }
                $scope.newComment._id = $scope.views[$scope.active]._id;
                $http.post('/addComment', $scope.newComment).success(function(response) {
                    $scope.getComments();
                    $scope.newComment = {};
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };
            $scope.deleteComment = function(delComment)
            {
                var sent = 
                {
                    comment: delComment,
                    view: $scope.views[$scope.active]._id
                };
                $http.post('/deleteComment', sent).success(function(response) {
                    $scope.getComments();
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };

        /*
        * Notes
        */ 
            $scope.noteTopics = [];
            $scope.getNotes = function()
            {   $scope.noteTopics = [];
                $http.post('/getNotes', {_id:  $scope.views[$scope.active]._id }).success(function(response) {
                    $scope.views[$scope.active].notes = response;
                    $scope.views[$scope.active].notes.forEach(function(note){
                        if($scope.noteTopics.indexOf(note.topic)<0)
                        {
                            $scope.noteTopics.push(note.topic);
                        }
                    });
                    console.log('TOPICS:')
                    console.log($scope.noteTopics);
                }).error(function(response) {
                    $scope.error = response.message;
                });

            } 
            $scope.newNote = {};
            $scope.addNote = function()
            {  if($scope.newNote.text.length==0 || $scope.newNote.text.length==undefined || $scope.newNote.title.length==0 || $scope.newNote.title.length==undefined || $scope.newNote.topic.length==0 || $scope.newNote.topic.length==undefined)
                {
                    console.log('Too short');
                    return;
                }
                $scope.newNote._id = $scope.views[$scope.active]._id;
                $http.post('/addNote', $scope.newNote).success(function(response) {
                    $scope.getNotes();
                    $scope.newNote = {};
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };
            $scope.deleteNote = function(delNote)
            {
                var sent = 
                {
                    note: delNote,
                    view: $scope.views[$scope.active]._id
                };
                $http.post('/deleteNote', sent).success(function(response) {
                    $scope.getNotes();
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };        
        /*
        * Nav and Right-Panel Javascript
        */

            $("[data-toggle=popover]").popover({
                html: true,
                'container': 'body', 
                'content': function()
                {
                    return $compile($("#popover-content").html())($scope);
                }
            });
             
            $(':not(#anything)').on('click', function (e) {
                $('[data-toggle="popover"]').each(function () {
                    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                        $(this).popover('hide');
                        $(".popover").remove();


                    }
                });
            });

            $scope.uploadType={};
           $scope.uploadTypeChange = function()
           {
                if($scope.uploadType.name=="fromDB")
                {
                    $scope.databaseDownload('databaseGraphs');
                }
                else if($scope.uploadType.name=="importCSV")
                {
                    $scope.fileUpload('csv');

                }
                else if($scope.uploadType.name=="blastFasta")
                {
                        $scope.fileUpload('blast');
                }
                else if($scope.uploadType.name=="microArray")
                {
                        $scope.fileUpload('microArr');

                }
           };
            $.asm = {};
            $.asm.panels = 1;
            function rightpanel(panels) {
                $.asm.panels = panels;
                if (panels === 1) {
                  $('#rightpanel').animate({
                        right: -330,
                  });
                } else if (panels === 2) {
                 
                    $('#rightpanel').animate({
                        right: 0,
                    });
                //            $('#rightpanel').height($(window).height() - 50);   
                }
            };
            $('#toggleRightpanel').click(function() {
              if ($.asm.panels === 1) {
                $scope.toggleArrow=false;
                $scope.$apply();
                return rightpanel(2);   
              } else {
                $scope.toggleArrow=true;
                $scope.$apply();
                return rightpanel(1);
              }
            });

});


