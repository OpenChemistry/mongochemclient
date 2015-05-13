require('script!3Dmol/release/3Dmol.js');

angular.module('mongochemApp')
    .controller('mongochemMoleculeHome', ['mongochem.Molecule', '$scope', function(Molecule, $scope) {
        $scope.mol = Molecule.get({moleculeId: 'TYQCGQRIZGCHNB-DUZGATOHSA-N'}, function(mol) {
            $scope.viewer.addModel(mol.xyz, 'xyz');
            $scope.viewer.setStyle({}, {stick:{}});
            $scope.viewer.zoomTo();
            $scope.viewer.render();
        });
    }])
    .controller('mongochemMoleculeDetail', ['mongochem.Molecule', '$scope', '$stateParams', function(Molecule, $scope, $stateParams) {
        $scope.mol = Molecule.get({moleculeId: $stateParams.moleculeId}, function(mol) {
            $scope.viewer.addModel(mol.xyz, 'xyz');
            $scope.viewer.setStyle({}, {stick:{}});
            $scope.viewer.zoomTo();
            $scope.viewer.render();
        });
    }])
    .controller('mongochemMolecules', ['Molecules', '$scope', function(Molecules, $scope) {
        $scope.molecules = Molecules.query();
    }])
    .directive('mongochem3dmol', ['$timeout', function($timeout) {
        return {
            link: function postLink($scope, $element) {
                // Run in next digest so we get the right element size
                $timeout(function() {
                    // Viewer config - properties 'defaultcolors' and 'callback'
                    var config = {defaultcolors: $3Dmol.rasmolElementColors };

                    // Create GLViewer within $element
                    $scope.viewer = $3Dmol.createViewer($($element), config);
                    $scope.viewer.setBackgroundColor(0xefefef);
                    $scope.viewer.resize();
                });
            }
        };
    }]);
