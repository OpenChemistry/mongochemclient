angular.module('chemPhyWebApp')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/home', {
          templateUrl: require('./components/home/home.jade')
        }).
        when('/about', {
          templateUrl: require('./components/about/about.jade')
        }).
        otherwise({
          redirectTo: '/home'
        });
  }]);
