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
 
 modalControllers.deleteViewCtrl = function($scope, $modalInstance, view) {
    $scope.view = view;
    console.log($scope.view);
    $scope.ok = function () {
       $modalInstance.close(true);
    };

    $scope.cancel = function () {
       $modalInstance.dismiss('cancel');
    };
                
};