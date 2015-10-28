require.ensure(['script!3Dmol/build/3Dmol.js'], function(require) {

    require('script!3Dmol/build/3Dmol.js');

    // Define our own parser for chemical JSON files, using cjson extension.
    $3Dmol.Parsers.cjson = function(jsonMol) {

        var elementSymbols = [
            "Xx", "H", "He", "Li", "Be", "B", "C", "N", "O", "F",
            "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K",
            "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu",
            "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y",
            "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In",
            "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr",
            "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm",
            "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au",
            "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac",
            "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es",
            "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt",
            "Ds", "Rg", "Cn", "Uut", "Uuq", "Uup", "Uuh", "Uus", "Uuo" ];

        var atoms = [[]];
        var coords = jsonMol.atoms.coords['3d'];
        var elements = jsonMol.atoms.elements.number;
        var bonds = jsonMol.bonds.connections.index;
        var order = jsonMol.bonds.order;
        for (var i = 0; i < elements.length; ++i) {
            var atom = {};
            atom.index = i;
            atom.serial = i;
            atom.elem = elementSymbols[elements[i]];
            atom.x = coords[3 * i + 0];
            atom.y = coords[3 * i + 1];
            atom.z = coords[3 * i + 2];

            atom.bonds = [];
            atom.bondOrder = [];

            atoms[0].push(atom);
        }
        for (var j = 0; j < order.length; ++j) {
            var atom1 = atoms[0][bonds[2 * j + 0]];
            var atom2 = atoms[0][bonds[2 * j + 1]];
            if (typeof(atom1) != 'undefined' && typeof(atom2) != 'undefined') {
                atom1.bonds.push(atom2.serial);
                atom1.bondOrder.push(order[j]);
                atom2.bonds.push(atom1.serial);
                atom2.bondOrder.push(order[j]);
            }

        }
        return atoms;
    };

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
                                              'mongochem.VibrationalModes', 'mongochem.Calculations.CJSON',
                                              '$scope', '$state', '$timeout', '$rootScope',
                                              function(Molecule, Calculations,
                                                       VibrationalModes,
                                                       CJSON, $scope, $state, $timeout, $rootScope) {

            // Set the default style
            $scope.style = {stick:{}, sphere: {scale: 0.3}};
            $scope.experiments = [{
                name: 'Simulated'
            }];

            var fetchMolecule = function(inichikey) {
                $scope.mol = Molecule.getByInchiKey({moleculeId: inichikey}, function(mol) {
                    $scope.viewer.clear();
                    $scope.displayMolecule(mol, $scope.style);

                    // Fetch the calculations associated with this molecule
                    $scope.calcs = Calculations.query({moleculeId: mol._id}, function(calcs) {
                        if (calcs.length > 0) {
                            // Show the first vibrational modes for the first calculation
                            $scope.vibrationalModes = calcs[0].vibrationalModes;
                        }
                        else {
                            $scope.vibrationalModes = null;
                        }
                    });
                });
            };

            $scope.displayMolecule = function(mol, style) {
                // If we have it use SDF as it has bond information
                if ('cjson' in mol) {
                    $scope.viewer.addModel(mol.cjson, 'cjson');
                }
                else if ('sdf' in mol) {
                    $scope.viewer.addModel(mol.sdf, 'sdf');
                }
                else {
                    $scope.viewer.addModel(mol.xyz, 'xyz');
                }
                $scope.viewer.setStyle({}, style);
                $scope.viewer.zoomTo();
                $scope.viewer.render();
            };

            // Set the default scale factor for vibrations.
            $scope.spectra = {};
            $scope.spectra.scale = 50;

            $scope.setViewStyle = function(style) {
                if (style == 'ball') {
                    $scope.style = {sphere:{}};
                }
                else if (style == 'stick') {
                    $scope.style = {stick:{}};
                }
                else {
                    $scope.style = {stick:{}, sphere: {scale: 0.3}};
                }

                // It seems that the model is not retained, add it back.
                if (!$scope.viewer.isAnimated()) {
                    $scope.displayMolecule($scope.mol, $scope.style);
                }

            };

            $scope.setInchiKey = function(inchikey) {
                $scope.animModel = null;
                $scope.modeFrames = null;
                $scope.sdf = null;

                if ($scope.viewer) {
                    $scope.viewer.stopAnimate();
                }

                fetchMolecule(inchikey);
            };

            $scope.showMolecule = function() {
                $state.go('molecule', {moleculeId: $scope.selectedMolecule.inchikey });
            };

            $scope.hasAnimation = function() {
                return $scope.modeFrames && $scope.cjson;
            };

            $scope.hasSpectra = function() {
                return $scope.vibrationalModes;
            };

            $scope.animateMolecule = function() {

                if ($scope.viewer.isAnimated()) {
                    $scope.viewer.stopAnimate();
                }
                else {
                    if (!$scope.animModel) {
                        let atoms = [];
                        atoms = $3Dmol.Parsers.cjson($scope.cjson, {})[0];

                        $scope.viewer.removeAllModels();
                        $scope.animModel = $scope.viewer.createModelFrom({serial: -1}, false);

                        angular.forEach($scope.modeFrames, function(frame) {
                            var frameAtoms = angular.copy(atoms);
                            // Now update the atoms positions
                            for (var i = 0; i < frameAtoms.length; ++i) {
                                frameAtoms[i].model = $scope.animModel.getID();
                                frameAtoms[i].color = $3Dmol.elementColors.rasmol[frameAtoms[i].elem];
                                frameAtoms[i].x = frame[i].x;
                                frameAtoms[i].y = frame[i].y;
                                frameAtoms[i].z = frame[i].z;
                                frameAtoms[i].index = i;
                            }

                            $scope.animModel.addFrame(frameAtoms);
                        });

                        //$scope.viewer.zoomTo();
                        $scope.animModel.setStyle({}, $scope.style);
                        $scope.viewer.render();
                    }
                    $scope.viewer.animate({interval: 75, loop: "forward", reps: 0});
                }
            };

            $scope.updateFrames = function() {
                var wasAnimated = false;
                if ($scope.viewer && $scope.viewer.isAnimated()) {
                    $scope.viewer.stopAnimate();
                    wasAnimated = true;
                }
                if ($scope.cjson) {
                    $scope.animModel = null;
                    $scope.modeFrames = $scope.generateFrames();
                }
                if (wasAnimated) {
                    // This timeout is required because of a "feature" of the
                    // 3Dmol animation. The stopAnimate(...) only sets the
                    // animate flag to false, is doesn't terminate the animation
                    // loop. This flag is checked by the animation loop in order to
                    // break out, however, if we don't wait for the animate loop
                    // todo this check and break out before called animate(...)
                    // again ( which resets this flag ) we end up with two
                    // animation loops!
                    $timeout($scope.animateMolecule, 100);
                }
            };

            $scope.addDisplacementVector = function(position, displacement, factor) {
                let newVector = displacement.clone();
                let starting = position.clone();
                newVector.multiplyScalar(factor);
                starting.add(newVector);
                return starting;
            };

            $scope.generateFrames = function(mode) {
                mode = typeof mode !== 'undefined' ? mode : $scope.spectra.mode;
                $scope.spectra.mode = mode;
                let eigenVector = $scope.cjson.vibrations.eigenVectors[mode-1];
                let amplitude = $scope.spectra.scale;
                let numberOfFrames = 5;
                let factor = 0.01 * amplitude;
                let coords =  $scope.cjson.atoms.coords['3d'];
                let numberOfAtoms = coords.length / 3;
                let frames = [];

                let atomPositions = [];
                let atomDisplacements = [];
                let atomPositionIndex = 0;
                for (let atom = 0; atom < numberOfAtoms; ++atom) {
                    let pos = new $3Dmol.Vector3(coords[atomPositionIndex], coords[atomPositionIndex + 1], coords[atomPositionIndex + 2]);
                    atomPositions.push(pos);
                    let displacement  = new $3Dmol.Vector3(eigenVector[atomPositionIndex], eigenVector[atomPositionIndex + 1], eigenVector[atomPositionIndex + 2]);
                    atomDisplacements.push(displacement);
                    atomPositionIndex += 3;
                }

                // Current coords + displacement.
                for (let i = 1; i <= numberOfFrames; ++i) {
                    let framePositions = [];
                    for (let atom = 0; atom < numberOfAtoms; ++atom) {
                        framePositions.push($scope.addDisplacementVector(atomPositions[atom],
                                                                         atomDisplacements[atom],
                                                                         factor * i / numberOfFrames));
                    }
                    frames.push(framePositions);
                }
                // + displacement back to original.
                for (let i = numberOfFrames - 1; i >=0; --i) {
                    let framePositions = [];
                    for (let atom = 0; atom < numberOfAtoms; ++atom) {
                        framePositions.push($scope.addDisplacementVector(atomPositions[atom],
                                                                         atomDisplacements[atom],
                                                                         factor * i / numberOfFrames));
                    }
                    frames.push(framePositions);
                }
                // Current coords - displacement.
                for (let i = 1; i <= numberOfFrames; ++i) {
                    let framePositions = [];
                    for (let atom = 0; atom < numberOfAtoms; ++atom) {
                        framePositions.push($scope.addDisplacementVector(atomPositions[atom],
                                                                         atomDisplacements[atom],
                                                                        -factor * i / numberOfFrames));
                    }
                    frames.push(framePositions);
                }
                // - displacement back to original.
                for (let i = numberOfFrames - 1; i >=0; --i) {
                    let framePositions = [];
                    for (let atom = 0; atom < numberOfAtoms; ++atom) {
                        framePositions.push($scope.addDisplacementVector(atomPositions[atom],
                                                                         atomDisplacements[atom],
                                                                        -factor * i / numberOfFrames));
                    }
                    frames.push(framePositions);
                }

                return frames;
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

            $scope.animateMode = function(mode) {
                // Cancel any existing animation loop
                $scope.viewer.stopAnimate();

                // TODO We shouldn't need to get the CJSON everytime
                CJSON.get({
                    id: $scope.calcs[0]._id
                },function(data) {
                    $scope.cjson = data.cjson;
                    $scope.modeFrames = $scope.generateFrames(mode);
                    $scope.animModel = null;
                    // Ensure we don't start two animation timers, use timeout.
                    $timeout($scope.animateMolecule, 100);
                });
            };

            $scope.modeSelected = function() {
                $rootScope.$broadcast('mongochem-frequency-histogram-selectbar', $scope.spectra.mode - 1);
                $scope.animateMode($scope.spectra.mode);
            };

            $scope.experimentSelected = function() {
                $scope.vibrationalModes.simulateExperimental = $scope.spectra.experiment === 'Simulated';
            };

            $scope.$on('mongochem-frequency-histogram-clickbar', function(evt, data) {
                $scope.animateMode(data.mode);
            });
        }])
        .controller('mongochemMoleculeDetail', ['mongochem.Molecule', '$scope', '$stateParams', function(Molecule, $scope, $stateParams) {
            $scope.mol = Molecule.getByInchiKey({moleculeId: $stateParams.moleculeId}, function(mol) {
                $scope.displayMolecule(mol , $scope.style);
            });
        }])
        .controller('mongochemMolecules', ['Molecules', '$scope', '$rootScope', function(Molecules, $scope, $rootScope) {
            function fetchMolecules() {
                $scope.molecules = Molecules.query({}, function(molecules) {
                    molecules.sort(function(a, b) {
                        return a.name.toLowerCase() > b.name.toLowerCase();
                    });
                    $scope.selectedMolecule = molecules[0];
                });
            }

            fetchMolecules();
            // Fetch the molecule list again if one has been added
            $rootScope.$on('mongochem-molecule-created', function() {
                fetchMolecules();
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
