app.controller("dealsDetailsCtrl", function($scope, $window, $location, $filter, $http, localstorage, $rootScope) {

    //for categorys dropdown list 
    $scope.categorys = ['', 'Electronics', 'Fashion', 'Household', 'Financial', 'Kids'];

    //for redirect to add deals page(new add deals) 
    $scope.newAddDealsFun = function() {
        $location.path("/addDeals");
        localstorage.set('isNew', true);
    };

    //for get deals
    var date = new Date();
    var activeDate = date.setDate(date.getDate())
    $scope.startDate = $filter('date')(activeDate, "yyyy-MM-dd");
    console.log("end date:" + $scope.startDate);

    var priorDate = date.setDate(date.getDate() - 30)
    $scope.endDate = $filter('date')(priorDate, "yyyy-MM-dd");
    console.log("start date:" + $scope.endDate);
    // getting deals from the web api
    $rootScope.dealsDataload = true;
    $http({
            url: 'https:quantumapiwebapi20181014093825.azurewebsites.net/api/v1/Deals/GetDeals?startDate=' + $scope.endDate + '&endDate=' + $scope.startDate,
            method: "GET",
            headers: { 'Content-Type': 'application/json-patch+json' }
        })
        .then(function(response) {
            $rootScope.dealsDataload = false;
            $scope.dealsDetails = response.data;
            //console.log(response);
        }, function(error) {
            //console.log(error);
        });

    // for deals details edit 
    $scope.editDeals = function(deal) {
        localstorage.setObject('editedDeal', deal);
        localstorage.set('isNew', false);
        $location.path('/addDeals');
    };

    // for deals details delete
    $scope.deleteDeals = function(deals) {
        $http({
                method: 'DELETE',
                url: 'https://quantumapiwebapi20181014093825.azurewebsites.net/api/v1/Deals/DeleteDeal/' + deals.id
            })
            .then(function(response) {
                if (response.statusText == 'OK') {
                    alert("Deals has deleted Successfully");
                    var index = $scope.dealsDetails.indexOf(deals);
                    $scope.dealsDetails.splice(index, 1);
                    // console.log(response);
                }
            }).catch(function(response) {
                alert("Error. while deleting deals Try Again!");
            });
    };

});