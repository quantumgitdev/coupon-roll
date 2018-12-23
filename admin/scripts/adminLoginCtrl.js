app.controller("adminLoginCtrl", function($scope, $http, $window, localstorage, $filter, $location) {
    // $scope.admin = {};
    // $scope.admin.userName = 'admin';
    // $scope.admin.password = 'quantumau';

    // admin login function
    $scope.loginFun = function() {
        $http({
                method: 'POST',
                url: 'https://quantumapiwebapi20181014093825.azurewebsites.net/api/v1/Auth/Login',
                data: $scope.admin
            })
            .then(function(response) {
                localstorage.set('token_String', response.data.tokenString);
                //  console.log(response);
                $location.path("/dealsDetails");
            }).catch(function(error) {
                alert('Please enter correct username and password..');
            });
    }

});