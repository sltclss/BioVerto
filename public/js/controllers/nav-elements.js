angular.module("MyApp")
        .controller('navElementsController', function($scope) {

        /*
        * Dashboard Javascript
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


           
        });


