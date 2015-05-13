require('script!3Dmol/release/3Dmol.js');

angular.module('mongochemApp')
    .filter('mongochemUnderscores', function() {
        return function(text) {
            var str = text.replace(/_/g, ' ');
            return str.charAt(0).toUpperCase() + str.substr(1);
        }
    })
    .controller('mongochemMoleculeHome', ['mongochem.Molecule', '$scope', function(Molecule, $scope) {
        $scope.mol = Molecule.getByInchiKey({moleculeId: 'TYQCGQRIZGCHNB-DUZGATOHSA-N'}, function(mol) {
            $scope.molXyz = mol.xyz;
            $scope.viewer.addModel(mol.xyz, 'xyz');
            $scope.viewer.setStyle({}, {stick:{}});
            $scope.viewer.zoomTo();
            $scope.viewer.render();
        });

        $scope.setViewStyle = function(style) {
            if (style == 'ball')
              $scope.viewer.setStyle({}, {sphere:{}});
            else if (style == 'stick')
                $scope.viewer.setStyle({}, {stick:{}});
            else
                $scope.viewer.setStyle({}, {line:{}});
            // It seems that the model is not retained, add it back.
            $scope.viewer.addModel($scope.molXyz, 'xyz');
            $scope.viewer.render();
        };
    }])
    .controller('mongochemMoleculeDetail', ['mongochem.Molecule', '$scope', '$stateParams', function(Molecule, $scope, $stateParams) {
        $scope.mol = Molecule.getByInchiKey({moleculeId: $stateParams.moleculeId}, function(mol) {
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
