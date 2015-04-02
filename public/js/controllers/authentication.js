angular.module("MyApp")
        .controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$window',
	function($scope, $http, $location, Authentication, $window) {

		$scope.authentication = Authentication;



		if ($scope.authentication.user) $location.path('/dashboard');

		$scope.signup = function() {
			if($scope.credentials.password!=$scope.credentials.rPassword)
			{
				$scope.error = "Re-typed password does not match";
			}else{
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				//Close the create account, login, and contact modal
				$scope.modal.close();

				// And redirect to the dashboard page
				$location.path('/dashboard');
			}).error(function(response) {
				$scope.error = response.message;
			});
		}
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				//Close the create account, login, and contact modal
				$scope.modal.close();

				// And redirect to the index page
				$location.path('/dashboard');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
