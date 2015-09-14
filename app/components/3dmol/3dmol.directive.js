require.ensure(['script!3Dmol/release/3Dmol.js'], function(require) {

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
        .controller('mongochemMoleculeHome', ['mongochem.Molecule', 'mongochem.Calculations',
                                              'mongochem.VibrationalModes', 'mongochem.Calculations.SDF',
                                              '$scope', '$state', '$timeout', '$log',
                                              '$http', '$interval', '$rootScope',
                                              function(Molecule, Calculations, VibrationalModes,
                                                      SDF, $scope, $state, $timeout, $log, $http,
                                                      $interval, $rootScope) {

            var fetchMolecule = function(inichikey) {
                $scope.mol = Molecule.getByInchiKey({moleculeId: inichikey}, function(mol) {
                    $scope.viewer.clear();
                    $scope.displayMolecule(mol, {stick:{}});

                    // Fetch the calculations associated with this molecule
                    $scope.calcs = Calculations.query({moleculeId: mol._id}, function(calcs) {
                        if (calcs.length > 0) {
                            // Show the first vibrational modes for the first calculation
                            $scope.vibrationalModes = calcs[0].vibrationalModes
                        }
                        else {
                            $scope.vibrationalModes = null;
                        }
                    });
                });
            }

            $scope.displayMolecule = function(mol, style) {
                // If we have it use SDF as it has bond information
                if ('sdf' in mol) {
                    $scope.viewer.addModel(mol.sdf, 'sdf');
                }
                else {
                    $scope.viewer.addModel(mol.xyz, 'xyz');
                }
                $scope.viewer.setStyle({}, style);
                $scope.viewer.zoomTo();
                $scope.viewer.render();
            };

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
                    $scope.displayMolecule($scope.mol, $scope.style);
                }

            };

            $scope.setInchiKey = function(inchikey) {
                $scope.isAnimating = false;
                $scope.models = null;
                $scope.modeFrames = null;
                $scope.sdf = null
                if ($scope.animationPromise) {
                    $interval.cancel($scope.animationPromise);
                    $scope.animationPromise = null;
                }

                fetchMolecule(inchikey);
            };

            $scope.showMolecule = function() {
                $state.go('molecule', {moleculeId: $scope.selectedMolecule.inchikey });
            };

            $scope.hasAnimation = function() {
                return $scope.modeFrames && $scope.sdf;
            };

            $scope.isAnimating = false;

            $scope.animateMolecule = function() {

                if ($scope.isAnimating) {

                    if ($scope.animationPromise) {
                        $interval.cancel($scope.animationPromise);
                        $scope.animationPromise = null;
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
                            //$rootScope.$broadcast('mongochem-frequency-histogram-selectbar', $scope.currmol);
                        }, 100);
                    };

                    if (!$scope.models) {
                        $scope.currmol = 0;
                        $scope.models = [];
                        let atoms = []
                        $3Dmol.Parsers['sdf'](atoms, $scope.sdf, {})

                        $scope.viewer.removeAllModels();

                        angular.forEach($scope.modeFrames, function(frame) {
                            var model = $scope.viewer.createModelFrom({serial: -1}, false);
                            $scope.models.push(model);

                            var frameAtoms = angular.copy(atoms);

                            // Now update the atoms positions
                            let frameAtomIndex = 0;
                            for(var i = 0; i < frameAtoms.length; i++) {
                                frameAtoms[i].model = model.getID();
                                frameAtoms[i].color = $3Dmol.elementColors.rasmol[frameAtoms[i].elem];
                                frameAtoms[i].x = frame[frameAtomIndex];
                                frameAtoms[i].y = frame[frameAtomIndex+1];
                                frameAtoms[i].z = frame[frameAtomIndex+2];
                                frameAtoms[i].index = i
                                frameAtomIndex += 3
                            }

                            model.addAtoms(frameAtoms);
                            model.setStyle({}, {stick:{hidden: true}});
                            //model.setStyle({}, $scope.style);
                        });

                        //$scope.viewer.zoomTo();
                        $scope.viewer.render();
                        animate();
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

            $scope.showFrequenciesHistogram = true;

            $scope.toggleFrequencies = function() {
                $scope.showFrequenciesHistogram = !$scope.showFrequenciesHistogram;
            };

            $scope.$on('mongochem-frequency-histogram-clickbar', function(evt, data) {
                // Cancel any existing animation loop
                if ($scope.animationPromise) {
                    $interval.cancel($scope.animationPromise);
                    $scope.animationPromise = null;
                }
                $scope.isAnimating = false;
                // Get the frames for this mode
                $scope.mode = data.mode;

                VibrationalModes.get({
                    id: $scope.calcs[0]._id,
                    mode: $scope.mode
                }, function(data) {
                    $scope.models = null;
                    $scope.modeFrames = data.frames
                });

                SDF.get({
                    id: $scope.calcs[0]._id
                },function(data) {
                    $scope.sdf = data.sdf;
                });
            })
        }])
        .controller('mongochemMoleculeDetail', ['mongochem.Molecule', '$scope', '$stateParams', function(Molecule, $scope, $stateParams) {
            $scope.mol = Molecule.getByInchiKey({moleculeId: $stateParams.moleculeId}, function(mol) {
                $scope.displayMolecule(mol , {stick:{}});
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
});