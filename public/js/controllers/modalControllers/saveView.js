 /*
 *
 * Sarah Talty <sltalty@ufl.edu>
 *
 * Based on earlier code:
 * Kartik Chivukula <https://github.com/kartikgc/>
 *
 * University of Florida
 *
 */
 
 if (typeof  modalControllers === 'undefined')
 modalControllers = {};
 
 modalControllers.saveViewCtrl = function($scope, $modalInstance, $http, view) {
    $scope.view = view;
    $scope.formData = {};

    $scope.save = function()
    {           
        $scope.formData.graphName= view.graphName;
        $scope.formData.graphLayout= view.layout;
        $scope.formData.state = view.state;

        $http.post('/createView', $scope.formData).success(function(response) {
            $scope.ok(response);
        }).error(function(response) {
            $scope.error = response.message;
        });
    };

    $scope.modal = $modalInstance;

    $scope.ok = function(response) {
         $modalInstance.close(response);
    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
                
};