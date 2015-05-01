require('script!3Dmol/release/3Dmol.js')
require('style/3dmol.styl')

angular.module('chemPhyWebApp')
    .directive('chemPhyWeb3dmol', ['$log', '$http', function($log, $http) {

        return {
            scope: {},
            controller: function($scope) {

            },
            link: function($scope, $element) {
                // Viewer config - properties 'defaultcolors' and 'callback'
                var config = {defaultcolors: $3Dmol.rasmolElementColors };

                // Create GLViewer within 'gldiv'
                $scope.viewer = $3Dmol.createViewer($($element), config);
                $3Dmol.download('pdb:2POR', $scope.viewer);
                $scope.viewer.resize();
            }
        }
    }]);