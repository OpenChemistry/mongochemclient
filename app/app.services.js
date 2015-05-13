require('angular-resource');
var mongochemServices = angular.module('mongochem.services', ['ngResource']);

mongochemServices.factory('mongochem.Molecule', ['$resource',
  function($resource){
    return $resource('api/v1/molecules/:id', {id: '@id'}, {
      getByInchiKey: {url: 'api/v1/molecules/inchikey/:moleculeId', method:'GET'},
      update: {method: 'PATCH'}
  });
}]);
mongochemServices.factory('Molecules', ['$resource',
  function($resource){
    return $resource('api/v1/molecules/:moleculeId', {}, {
      query: {method:'GET', params:{moleculeId:''}, isArray:true}
  });
}]);
