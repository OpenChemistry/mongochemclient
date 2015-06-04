require('script!3Dmol/release/3Dmol.js');

angular.module('mongochemApp')
    .filter('mongochemUnderscores', function() {
        return function(text) {

            if (!text) {
                return text;
            }

            var str = text.replace(/_/g, ' ');
            return str.charAt(0).toUpperCase() + str.substr(1);
        };
    })
    .controller('mongochemMoleculeHome', ['mongochem.Molecule', '$scope', function(Molecule, $scope) {
        $scope.mol = Molecule.getByInchiKey({moleculeId: 'TYQCGQRIZGCHNB-DUZGATOHSA-N'}, function(mol) {
            $scope.viewer.addModel(mol.xyz, 'xyz');
            $scope.viewer.setStyle({}, {stick:{}});
            $scope.viewer.zoomTo();
            $scope.viewer.render();
        });

        $scope.setViewStyle = function(style) {
            if (style == 'ball') {
              $scope.viewer.setStyle({}, {sphere:{}});
            }
            else if (style == 'stick') {
                $scope.viewer.setStyle({}, {stick:{}});
            }
            else {
                $scope.viewer.setStyle({}, {line:{}});
            }
            // It seems that the model is not retained, add it back.
            $scope.viewer.addModel($scope.mol.xyz, 'xyz');
            $scope.viewer.render();
        };
        $scope.setInchiKey = function(inchikey) {
            $scope.mol = Molecule.getByInchiKey({moleculeId: inchikey}, function(mol) {
                $scope.viewer.clear();
                $scope.viewer.addModel(mol.xyz, 'xyz');
    $scope.viewer.setStyle({}, {stick:{}});
    $scope.viewer.zoomTo();
    $scope.viewer.render();
      });
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
        $scope.molecules = Molecules.query({}, function(molecules) {
        $scope.selectedMolecule = molecules[0];
        });
    }])
    .controller('mongochemMoleculeWatchScope', ['Molecules', '$scope', function(Molecules, $scope) {
        $scope.$watch('xyz', function(newVal, oldVal) {

            if (!$scope.viewer) {
                return;
            }
            $scope.viewer.clear();
            $scope.viewer.resize();
            $scope.viewer.addModel(newVal, 'xyz');
            $scope.viewer.setStyle({}, {stick:{}});
            $scope.viewer.zoomTo();
            $scope.viewer.render();
        });
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

                    // Remove postion:absolute from canvas
                    // We should look at patching 3DMol
                    let canvas = $element.find('canvas')
                    let style = canvas.attr('style');
                    style = style.replace(/position:\s*absolute/g, '');
                    canvas.attr('style', style);

                    $scope.viewer.setBackgroundColor(0xefefef);
                    $scope.viewer.resize();
                });
            }
        };
    }]);
