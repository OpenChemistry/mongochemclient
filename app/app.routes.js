angular.module('chemPhyWebApp')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/home', {
          templateUrl: require('./components/home/home.html')
        }).
        when('/about', {
          templateUrl: require('./components/about/about.html')
        }).
        otherwise({
          redirectTo: '/home'
        });
  }]);
