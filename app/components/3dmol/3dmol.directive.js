require('script!3Dmol/release/3Dmol.js');
require('style/3dmol.styl');

angular.module('chemPhyWebApp')
    .directive('chemPhyWeb3dmol', ['$http', '$log', function($http, $log) {

        return {
            scope: {},
            link: function($scope, $element) {
                // Viewer config - properties 'defaultcolors' and 'callback'
                var config = {defaultcolors: $3Dmol.rasmolElementColors };

                // Create GLViewer within 'gldiv'
                $scope.viewer = $3Dmol.createViewer($($element), config);
                $scope.viewer.setBackgroundColor(0xeeeeee);
                $scope.viewer.resize();

                $http.get('/data/2POR.pdb')
                    .success(function(data) {
                        $scope.viewer.addModel(data, 'pdb');
                        $scope.viewer.setStyle({}, {stick:{}});
                        $scope.viewer.zoomTo();
                        $scope.viewer.render();
                    })
                    .error(function(data) {
                        $log.error(data);
                    });
            }
        };
    }]);