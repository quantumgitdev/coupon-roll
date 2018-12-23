app.controller("adminCtrl", function($scope, $window, $location) {
    $scope.logoutFun = function() {
        //delete $window.sessionStorage;
        $window.localStorage.clear();
        $location.path('/');
    };
});