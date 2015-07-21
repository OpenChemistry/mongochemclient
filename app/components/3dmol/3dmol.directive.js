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
    .controller('mongochemMoleculeHome', ['mongochem.Molecule', '$scope', '$state',
                                          '$timeout', '$log', '$http', '$interval',
                                          function(Molecule, $scope, $state, $timeout,
                                                   $log, $http, $interval) {
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

            // It seems that the model is not retained, add it back.
            if (!$scope.isAnimating) {
                $scope.viewer.setStyle({}, $scope.style);
                $scope.viewer.addModel($scope.mol.xyz, 'xyz');
                $scope.viewer.render();
            }

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

        $scope.showMolecule = function() {
            $state.go('molecule', {moleculeId: $scope.selectedMolecule.inchikey });
        };

        $scope.hasAnimation = function() {
            return $scope.selectedMolecule && $scope.selectedMolecule.inchikey === 'RYYVLZVUVIJVGH-UHFFFAOYSA-N';
        };

        $scope.isAnimating = false;

        $scope.animateMolecule = function() {

            if ($scope.isAnimating) {

                if ($scope.animationPromise) {
                    $interval.cancel($scope.animationPromise);
                }

                $scope.isAnimating = false;
            }
            else {
                $scope.isAnimating = true;

                let animate = function() {
                    $scope.animationPromise = $interval(function() {
                        $scope.models[$scope.currmol].setStyle({},{hidden:true});
                        $scope.currmol = ($scope.currmol+1) % $scope.models.length;
                        $scope.models[$scope.currmol].setStyle({}, $scope.style);
                        $scope.viewer.render();
                    }, 100);
                };

                if (!$scope.models) {
                    $scope.currmol = 0;
                    $.get('/data/caffeine.json').
                        success(function(data) {
                            $scope.models = [];

                            $scope.viewer.removeAllModels();
                            angular.forEach(data.deltas, function(delta) {
                                var model = $scope.viewer.createModelFrom({serial: -1}, false);
                                $scope.models.push(model);

                                var atoms = angular.copy(data.atoms);

                                // Now add the delta to atom positions
                                for(var i = 0; i < atoms.length; i++) {
                                    atoms[i].model = model.getID();
                                    atoms[i].color = $3Dmol.elementColors.rasmol[atoms[i].elem];
                                    atoms[i].x += delta[i][0];
                                    atoms[i].y += delta[i][1];
                                }

                                model.addAtoms(atoms);
                                model.setStyle({}, {stick:{hidden: true}});

                            });

                            $scope.viewer.zoomTo();
                            $scope.viewer.render();
                            animate();
                        }).
                        error(function(data) {
                            $log.error(data);
                        });
                }
                else {
                    animate();
                }
            }
        };

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
