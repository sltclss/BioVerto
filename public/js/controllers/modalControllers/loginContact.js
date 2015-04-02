 if (typeof  modalControllers === 'undefined')
 modalControllers = {};
 
 modalControllers.loginContact = function($scope, $modalInstance) {
 				$scope.modal = $modalInstance;
                $scope.ok = function() {
                     $modalInstance.close();
                }
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };

            };