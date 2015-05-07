var angular = require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-material/angular-material.css');
require('style/common.styl');

angular.module('chemPhyWebApp', [require('angular-ui-router'), 'ngMaterial']);
