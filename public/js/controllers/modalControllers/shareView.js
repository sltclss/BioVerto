 if (typeof  modalControllers === 'undefined')
 modalControllers = {};
 
 modalControllers.shareView = function($scope, $modalInstance, $http, view, Authentication) {
    $scope.authentication = Authentication;
    $scope.view = view;
    $scope.selected = {};
    $scope.sharingList = [];
    $scope.userList = [];
    $scope.getSharingList = function()
    {
        $http.post('/sharingList', {view: $scope.view._id}).success(function(response) {
            $scope.sharingList = response;
        }).error(function(response) {
            $scope.error = response.message;
        });
    };
    $scope.getUserList = function()
    {
        $http.get('/userList').success(function(response) {
            var results = [];
            response.forEach(function (user) {
              results.push(user.username);
            });
            var index = results.indexOf($scope.authentication.user.username);
            results.splice(index, 1);
            $scope.userList = results;
            console.log($scope.userList);
        }).error(function(response) {
            $scope.error = response.message;
        });
    };
    $scope.addUserToShare = function()
    {

        if($scope.selected.username==undefined) 
        {   
            return;
        }
        if($scope.sharingList.indexOf($scope.selected.username)==-1)
        {
            if($scope.userList.indexOf($scope.selected.username)>-1)
            {
                $scope.sharingList.push($scope.selected.username);
            }
        }
        $scope.selected.username=undefined;

    }
    $scope.removeShareUser = function(index)
    {
        delete $scope.sharingList[index];
        $scope.sharingList = $scope.sharingList.filter(function(e){return e}); 

        //http post remove user from sharing list in back-end
    }
    $scope.share = function(){
        var send =
        {
            _id: $scope.view._id,
            receivers: $scope.sharingList
        };
        $http.post('/shareView', send).success(function(response) {
            $scope.ok({isChanged: true, updatedList: response});
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