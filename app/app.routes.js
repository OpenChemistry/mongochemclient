angular.module('mongochemApp')
  .config(['$stateProvider', '$urlRouterProvider',
           function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/home");

      $stateProvider
          .state('home', {
            url: '/home',
            views: {
                main: {
                    templateUrl: require('./components/home/home.jade')
                }
            }
          })
          .state('molecules', {
            url: '/molecules/:moleculeId',
	    views: {
                main: {
                    templateUrl: require('./components/molecule/molecule.jade')
                }
            }
	  })
          .state('about', {
            url: '/about',
            views: {
                main: {
                    templateUrl: require('./components/about/about.jade')
                }
            }
          });
  }]);
