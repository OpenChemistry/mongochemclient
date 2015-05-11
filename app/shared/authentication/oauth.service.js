require('angular-resource');

angular.module('mongochem.services')
    .factory('mongochem.OAuthProvider', function($resource){
        return $resource('api/v1/oauth/provider');
    });