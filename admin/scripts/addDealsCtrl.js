 app.controller("addDealsCtrl", function($scope, $http, $location, localstorage, $filter) {

     $scope.dealsList = {}; //object for creating new deals

     $scope.categorys = ['Electronics', 'Fashion', 'Household', 'Financial', 'Kids']; // for selecting deals Category
     $scope.types = ['Online', 'In-line', 'Cashback', 'Discount', 'Clearence']; // for selecting deals Type
     $scope.statusList = ['Draft', 'Active', 'Expired', 'Removed']; // for selecting deals status


     var token_String = localstorage.get('token_String'); // login access token string

     $scope.uploadme1; //for hero image convert to base64
     $scope.uploadme2; // for add on images convert to base 64

     // for creating new deals send to database
     $scope.addDealsFun = function(dealsList) {
         var startDate = $filter('date')(dealsList.activeDate, "yyyy-MM-dd"); // for date filter 
         var endDate = $filter('date')(dealsList.expireDate, "yyyy-MM-dd"); //for date filter

         var postData = {
             title: dealsList.title,
             category: dealsList.category,
             description: dealsList.description,
             coupanCode: dealsList.coupanCode,
             type: dealsList.types,
             location: dealsList.location,
             url: dealsList.url,
             heroImage: $scope.uploadme1,
             status: dealsList.status,
             additionalImage: $scope.uploadme2,
             store: dealsList.store,
             activeDate: startDate,
             expireDate: endDate
         };
         // console.log(JSON.stringify(data));
         $http({
             url: "https://quantumapiwebapi20181014093825.azurewebsites.net/api/v1/Deals/AddDeal",
             method: "POST",
             data: postData,
             headers: {
                 'Content-Type': 'application/json-patch+json',
                 'X-Access-Token': token_String
             }
         }).then(function(response) {
             alert("Deals has created Successfully");
             //   console.log(data);
             //console.log(new Date());
             $location.path("/dealsDetails");
         }).catch(function(error) {
             alert("Deals has created Unsuccessfully");
             console.log(error);
         });
     };

     //all input fields clear 
     $scope.reset = function() {
         $scope.dealsList = {};
     };

     //for deals edit 
     var editDealObj = localstorage.getObject('editedDeal');
     var isNew = localstorage.get('isNew');
     if (isNew === 'false' && angular.isDefined(editDealObj)) {
         editDealObj.activeDate = new Date(editDealObj.activeDate);
         editDealObj.expireDate = new Date(editDealObj.expireDate);
         console.log(JSON.stringify(editDealObj));
         $scope.dealsList = editDealObj;
         $scope.update_Deals = true; // button shows for deals update
         $scope.cancel_UpdateDeals = true; //button for redirect from update page to dealsDetails page
     } else {
         $scope.clearDeals = true; // clear for all deals inputs fields
         $scope.addDeals = true; // add deals 
     }

     // for deals details updating
     $scope.updateDeals = function(dealsList) {
         var startDate = $filter('date')(dealsList.activeDate, "yyyy-MM-dd"); // for date filter 
         var endDate = $filter('date')(dealsList.expireDate, "yyyy-MM-dd"); //for date filter

         var postData = {
             id: dealsList.id,
             title: dealsList.title,
             category: dealsList.category,
             description: dealsList.description,
             coupanCode: dealsList.coupanCode,
             type: dealsList.types,
             location: dealsList.location,
             url: dealsList.url,
             store: dealsList.store,
             activeDate: startDate,
             expireDate: endDate,
             status: dealsList.status,
             heroImage: $scope.uploadme1,
             additionalImage: $scope.uploadme2
         };
         // console.log(JSON.stringify(data));
         $http({
             url: 'https://quantumapiwebapi20181014093825.azurewebsites.net/api/v1/Deals/UpdateDeal',
             method: 'PUT',
             data: postData
         }).then(function(response) {
             //   console.log(data);
             alert('Deals has updated Successfully');
             $location.path("/dealsDetails");
         }).catch(function(error) {
             alert('Deals has update Unsccessfully');
         });
     };

     //  for deals update cancel
     $scope.cancelUpdate = function() {
         $location.path("/dealsDeatails");
     };
 });