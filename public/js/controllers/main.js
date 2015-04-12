angular.module("MyApp")
        .controller('mainController', function($scope, $modal, modalCtrlProvider, $http, $compile, Authentication) {
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

            $scope.authentication = Authentication;
           
            $scope.randomSort = function(view) {
              return Math.random();
            };

            $scope.addView = function(layout, graphName, state)
            {
                if ($scope.newViewIndex !== 0 && typeof graphName === 'undefined')
                {
                    graphName = $scope.views[$scope.active].graphName;
                }
                
                $scope.active = $scope.newViewIndex;
                $scope.views[$scope.newViewIndex] = {layout: layout, title: "New View " + $scope.newViewIndex, graphName: graphName, indx: $scope.newViewIndex, state: state};
                
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
                delete $scope.views[index];
                //remove undefined values
                $scope.views = $scope.views.filter(function(n){ return n != undefined });

                // Select another view to be the active view
                // Simply pick the first view available
                // This is ugly but effective. There is no API to do this
                
                 for (var i in $scope.views) {
                    $scope.changeView(i);
                    return; // we got the first one
                }
               

            };
            $scope.panelFn = function(fntype, args)
            {
                $scope[fntype](args);
            };
            $scope.changeView = function(indx)
            {
                $scope.active = parseInt(indx);
                console.log($scope.active);

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
            $scope.loginContact = function()
            {
                var modalInstance = $modal.open({
                    templateUrl: './partials/loginContactModal.html',
                    controller: modalCtrlProvider.getCtrl("loginContact"),
                    windowClass: 'login-modal',
                    resolve: {
                        tabIndex: 1
                    },
                });
                modalInstance.result.then(function() {

                }, function() {
                    return;
                });
            };
            $scope.shareView = function(callFrom, index)
            {
                var modalInstance = $modal.open({
                    templateUrl: './partials/shareViewOpen.html',
                    controller: modalCtrlProvider.getCtrl("shareView"),
                    resolve: {
                        view: function() {
                            if(callFrom=='my-views')
                            {
                                return $scope.myViews[index];
                            }
                            return $scope.views[$scope.active];
                        }}
                });
                 modalInstance.result.then(function() {

                }, function() {
                    return;
                });
            };

            $scope.saveView = function(state)
            {
                var modalInstance = $modal.open({
                    templateUrl: './partials/saveViewOpen.html',
                    controller: modalCtrlProvider.getCtrl("saveView"),
                    resolve: {
                        view: function() {
                            return $scope.views[$scope.active];
                        }}
                });
                 modalInstance.result.then(function() {

                }, function() {
                    return;
                });
            /*
                var graphJson = CircularJSON.stringify(g5.graphs[state.graphName].getState());
                var viewJson = CircularJSON.stringify(state);
                console.log(graphJson);
                console.log(viewJson);
                var send =
                {
                   // graphJson: CircularJSON.stringify(g5.graphs[state.graphName].getState()),
                   // viewJson: CircularJSON.stringify(state)
                   viewState: state
                }
                $http.post('/createView', send).success(function(response) {
                    console.log(response);
                }).error(function(response) {
                    $scope.error = response.message;
                });
            */
            };
            
             $scope.getViewFromDB = function(state)
            {
                var send = 
                {
                    id : '54f6351a5279572d37c1f70f'
                };
                $http.post('/getView', send).success(function(response) {
                    console.log(response.state.layout);
                    console.log(response.state.graphName);
                    console.log(response.state);

                    //$scope.cloneView(response.state);
                }).error(function(response) {
                    $scope.error = response.message;
                });
                
            };
            $scope.myViews = [];
            $scope.getMyViews = function()
            {
                $http.get('/listByUser').success(function(response) {
                    console.log(response);
                    $scope.myViews=response;
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };
            $scope.sharedViews = [];
            $scope.getSharedViews = function()
            {
                console.log('getSharedViews called');
                $http.get('/shareWithMe').success(function(response) {
                    console.log(response);
                    $scope.sharedViews=response;
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
                $('#toggleRightpanel i').addClass('glyphicon-option-vertical');
                $('#toggleRightpanel i').removeClass('glyphicon-option-vertical');
                return rightpanel(2);
              } else {
                $('#toggleRightpanel i').removeClass('glyphicon-option-vertical');
                $('#toggleRightpanel i').addClass('glyphicon-option-vertical');
                return rightpanel(1);
              }
            });

});


