app.controller("adminCtrl", function($scope, $window, $location, $rootScope) {
    $scope.logoutFun = function() {
        //delete $window.sessionStorage;
        $window.localStorage.clear();
        $location.path('/login');
    };
    $rootScope.dealsDataload = false;
});