require('script!3Dmol/release/3Dmol.js');

angular.module('mongochemApp')
    .controller('mongochemMoleculeHome', ['Molecule', '$scope', function(Molecule, $scope) {
        $scope.inchi = 'methane';
    }])
    .controller('mongochemMoleculeDetail', ['Molecule', '$scope', '$stateParams', function(Molecule, $scope, $stateParams) {
        $scope.inchi = $stateParams.moleculeId;
    }])
    .directive('mongochem3dmol', ['Molecule', '$stateParams', '$log', '$timeout', function(Molecule, $stateParams, $log, $timeout) {
        return {
            link: function postLink($scope, $element) {

                // Run in next digest so we get the right element size
                $timeout(function() {
                    // Viewer config - properties 'defaultcolors' and 'callback'
                    var config = {defaultcolors: $3Dmol.rasmolElementColors };

                    // Create GLViewer within 'gldiv'
                    $scope.viewer = $3Dmol.createViewer($($element), config);
                    $scope.viewer.setBackgroundColor(0xeeeeee);
                    $scope.viewer.resize();

                    $scope.mol = Molecule.get({moleculeId: $scope.inchi}, function(mol) {
                      $scope.viewer.addModel(mol.xyz, 'xyz');
                      $scope.viewer.setStyle({}, {stick:{}});
                      $scope.viewer.zoomTo();
                      $scope.viewer.render();
                    });

/*		    $http.get('/data/2POR.pdb')
                        .success(function(data) {
                            $scope.viewer.addModel(data, 'pdb');
                            $scope.viewer.setStyle({}, {stick:{}});
                            $scope.viewer.zoomTo();
                            $scope.viewer.render();
                        })
                        .error(function(data) {
                            $log.error(data);
                        }); */
                });
            }
        };
    }]);
