 if (typeof  modalControllers === 'undefined')
 modalControllers = {};
 
 modalControllers.loginContact = function($scope, $modalInstance, tabNum) {
 				$scope.modal = $modalInstance;
				$scope.tab = {};
 				$scope.setup = function()
 				{
 					$scope.tab.num = tabNum;
 				};
                $scope.ok = function() {
                     $modalInstance.close();
                }
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };

            };