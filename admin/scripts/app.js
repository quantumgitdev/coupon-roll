var app = angular.module("adminApp", ["ngRoute"]);

//creating routing
app.config(
    function($routeProvider, $locationProvider) {
        $routeProvider.caseInsensitiveMatch = true;
        $routeProvider
            .when("/", {
                title: 'Admin:Login',
                templateUrl: "views/login.html",
                controller: "adminLoginCtrl",
                restrictions: {
                    ensureAuthenticated: true,
                    loginRedirect: false
                }
            })
            .when("/dealsDetails", {
                title: 'Deals details',
                templateUrl: "views/dealsdetails.html",
                controller: "dealsDetailsCtrl",
                restrictions: {
                    ensureAuthenticated: true,
                    loginRedirect: false
                }
            })
            .when("/addDeals", {
                title: 'Add deals',
                templateUrl: "views/addDeals.html",
                controller: "addDealsCtrl",
                restrictions: {
                    ensureAuthenticated: true,
                    loginRedirect: false
                }
            })
            .otherwise({
                redirectTo: "/dealsDetails"
            });

        function routeStart($rootScope, $location, $route) {
            $rootScope.$on('$routeChangeStart', (event, next, current) => {
                if (next.restrictions.ensureAuthenticated) {
                    if (!localstorage.getItem('token')) {
                        $location.path('/home');
                    }
                }
                if (next.restrictions.loginRedirect) {
                    if (localstorage.getItem('token')) {
                        $location.path('/' + next);
                    }
                }
            });
        }
        $locationProvider.hashPrefix(''); //for ! symbol remove 
        //  $locationProvider.html5Mode(true); // for # symbol remove
    }
);

//page title name dynamically change
app.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.currentPageTitle = current.$$route.title;
    });
}]);

// for image upload 
app.directive("fileread", [
    function() {
        return {
            scope: {
                fileread: "="
            },
            link: function(scope, element, attributes) {
                element.bind("change", function(changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function(loadEvent) {
                        scope.$apply(function() {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }
]);

// session timeout
app.run(function($rootScope, $document, $window, $location) {
    var date = new Date();
    var time = date.getTime(); //n in ms

    $rootScope.idleEndTime = time + (20 * 60 * 1000); //set end time to 20 min from now
    $document.find('body').on('mousemove keydown DOMMouseScroll mousewheel mousedown touchstart', checkAndResetIdle); //monitor events

    function checkAndResetIdle() //user did something
    {
        var date = new Date();
        var time = date.getTime(); //n in ms
        var currentPageUrl = $location.url(); // for Routing url('/')
        //console.log("current page url:" + currentPageUrl);
        if (time > $rootScope.idleEndTime && currentPageUrl != '/') {
            $document.find('body').off('mousemove keydown DOMMouseScroll mousewheel mousedown touchstart'); //un-monitor events
            $window.localStorage.clear();
            $window.location.href = 'http://127.0.0.1:5500/admin/index.html';
            alert('Session Timeout');
        }
        $rootScope.idleEndTime = time + (20 * 60 * 1000); //reset end time
    }
});