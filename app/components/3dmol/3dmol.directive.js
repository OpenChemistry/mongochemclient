require('script!3Dmol/release/3Dmol.js');

angular.module('mongochemApp')
    .directive('mongochem3dmol', ['$http', '$log', '$timeout', function($http, $log, $timeout) {

        return {
            scope: {},
            link: function postLink($scope, $element) {

                // Run in next digest so we get the right element size
                $timeout(function() {
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
                });
            }
        };
    }]);