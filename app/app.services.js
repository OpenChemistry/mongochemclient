require('angular-resource');
var mongochemServices = angular.module('mongochem.services', ['ngResource']);

mongochemServices.factory('mongochem.Molecule', ['$resource',
  function($resource){
    return $resource('api/v1/molecules/:id', {id: '@_id'}, {
      getByInchiKey: {url: 'api/v1/molecules/inchikey/:moleculeId', method:'GET'},
      update: {method: 'PATCH'},
      create: {method: 'POST', url: 'api/v1/molecules'}
  });
}]);
mongochemServices.factory('Molecules', ['$resource',
  function($resource){
    return $resource('api/v1/molecules/:moleculeId', {}, {
      query: {method:'GET', params:{moleculeId:''}, isArray:true}
  });
}]);
mongochemServices.factory('mongochem.Calculations', ['$resource',
  function($resource){
    return $resource('api/v1/calculations/:id', {id: '@_id'}, {});
}]);
mongochemServices.factory('mongochem.CalculationTypes', ['$resource',
  function($resource){
    return $resource('api/v1/calculations/types/:id', {id: '@_id'}, {});
}]);
mongochemServices.factory('mongochem.VibrationalModes', ['$resource',
  function($resource){
    return $resource('api/v1/calculations/:id/vibrationalmodes/:mode', {}, {
       get: {
           method: 'GET',
           transformResponse: function (data) {return {frames: angular.fromJson(data)};},
       }
    });
}]);
mongochemServices.factory('mongochem.MolecularOrbitals', ['$resource',
  function($resource){
    return $resource('api/v1/calculations/:id/cube/:mo', {}, {
       get: {
           method: 'GET',
           transformResponse: function (data) {return {cjson: JSON.parse(data)};},
       }
    });
}]);
mongochemServices.factory('mongochem.Calculations.SDF', ['$resource',
  function($resource){
    return $resource('api/v1/calculations/:id/sdf', {}, {
       get: {
           method: 'GET',
           transformResponse: function (data) {return {sdf: data};},
       }
   });
}]);
mongochemServices.factory('mongochem.Calculations.CJSON', ['$resource',
  function($resource){
    return $resource('api/v1/calculations/:id/cjson', {}, {
      get: {
          method: 'GET',
         transformResponse: function (data) {return {cjson: JSON.parse(data)};},
      }
  });
}]);


