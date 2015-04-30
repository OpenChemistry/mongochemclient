angular.module('chemPhyWebApp')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/home', {
          templateUrl: require('./partials/main.html')
        }).
        when('/about', {
          templateUrl: require('./partials/about.html')
        }).
        otherwise({
          redirectTo: '/home'
        });
  }]);
