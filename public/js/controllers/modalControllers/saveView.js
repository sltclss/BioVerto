 if (typeof  modalControllers === 'undefined')
 modalControllers = {};
 
 modalControllers.saveView = function($scope, $modalInstance, $http, view, Authentication) {
    $scope.authentication = Authentication;
    $scope.view = view;
    $scope.formData = {};
    $scope.save = function()
    {           
        $scope.formData.graphName= view.graphName;
        $scope.formData.graphLayout= view.layout;
        $http.post('/createView', $scope.formData).success(function(response) {
            console.log("Saved View:")
            console.log(response);
            $scope.ok();
        }).error(function(response) {
            $scope.error = response.message;
        });
    };
    $scope.modal = $modalInstance;
    $scope.ok = function() {
         $modalInstance.close();
    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
                
};