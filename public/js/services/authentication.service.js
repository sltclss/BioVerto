
// Authentication service for user variables
angular.module('MyApp').factory('Authentication', [ '$cookieStore',
	function($cookieStore) {

		var _this = this;
		//set global user variable from cookies
		_this._data = {
			user: $cookieStore.get('user')
		};
		console.log('Authentication');
		console.log($cookieStore.get('user'));
		return _this._data;
	}
]);
