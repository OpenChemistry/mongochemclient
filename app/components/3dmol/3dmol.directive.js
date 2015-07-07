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
    .controller('mongochemMoleculeHome', ['mongochem.Molecule', '$scope', '$state', '$timeout', function(Molecule, $scope, $state, $timeout) {
        $scope.mol = Molecule.getByInchiKey({moleculeId: 'TYQCGQRIZGCHNB-DUZGATOHSA-N'}, function(mol) {
            $scope.viewer.addModel(mol.xyz, 'xyz');
            $scope.viewer.setStyle({}, {stick:{}});
            $scope.viewer.zoomTo();
            $scope.viewer.render();
        });

        // Set the default style
        $scope.style = {stick:{}};

        $scope.setViewStyle = function(style) {
            if (style == 'ball') {
                $scope.style = {sphere:{}};
            }
            else if (style == 'stick') {
                $scope.style = {stick:{}};
            }
            else {
                $scope.style = {line:{}};
            }

            $scope.viewer.setStyle({}, $scope.style);

            // It seems that the model is not retained, add it back.
            $scope.viewer.addModel($scope.mol.xyz, 'xyz');
            $scope.viewer.render();
        };

        $scope.setInchiKey = function(inchikey) {
            $scope.mol = Molecule.getByInchiKey({moleculeId: inchikey}, function(mol) {

                $scope.viewer.clear();
                $scope.viewer.addModel(mol.xyz, 'xyz');
                $scope.viewer.setStyle({}, $scope.style);
                $scope.viewer.zoomTo();
                $scope.viewer.render();
            });
        };

        $scope.showMolecule = function(inchikey) {
            $state.go('molecule', {moleculeId: $scope.selectedMolecule.inchikey });
        }

        var dereg = $scope.$watch('selectedMolecule', function(selectedMolecule) {
            if (selectedMolecule) {
                $scope.setInchiKey(selectedMolecule.inchikey);
                // ng-change will takeover now
                dereg();
            }
        });
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
            molecules.sort(function(a, b) {
                return a.name.toLowerCase() > b.name.toLowerCase();
            });
            $scope.selectedMolecule = molecules[0];
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
                    let canvas = $element.find('canvas');
                    let style = canvas.attr('style');
                    style = style.replace(/position:\s*absolute/g, '');
                    canvas.attr('style', style);

                    $scope.viewer.setBackgroundColor(0xefefef);
                    $scope.viewer.resize();
                });
            }
        };
    }]);
