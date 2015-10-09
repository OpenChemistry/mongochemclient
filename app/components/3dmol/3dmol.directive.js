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
                                              'mongochem.VibrationalModes', 'mongochem.Calculations.SDF',
                                              '$scope', '$state',
                                              function(Molecule, Calculations,
                                                       VibrationalModes,
                                                       SDF, $scope, $state) {

            var fetchMolecule = function(inichikey) {
                $scope.mol = Molecule.getByInchiKey({moleculeId: inichikey}, function(mol) {
                    $scope.viewer.clear();
                    $scope.displayMolecule(mol, {stick:{}});

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
                    $scope.style = {stick:{hidden: false}, sphere: {scale: 0.3}};
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
                return $scope.modeFrames && $scope.sdf;
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
                        atoms = $3Dmol.Parsers.sdf($scope.sdf, {})[0];

                        $scope.viewer.removeAllModels();
                        $scope.animModel = $scope.viewer.createModelFrom({serial: -1}, false);

                        angular.forEach($scope.modeFrames, function(frame) {
                            var frameAtoms = angular.copy(atoms);
                            // Now update the atoms positions
                            let frameAtomIndex = 0;
                            for (var i = 0; i < frameAtoms.length; ++i) {
                                frameAtoms[i].model = $scope.animModel.getID();
                                frameAtoms[i].color = $3Dmol.elementColors.rasmol[frameAtoms[i].elem];
                                frameAtoms[i].x = frame[frameAtomIndex++];
                                frameAtoms[i].y = frame[frameAtomIndex++];
                                frameAtoms[i].z = frame[frameAtomIndex++];
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
                $scope.viewer.stopAnimate();
                // Get the frames for this mode
                $scope.mode = data.mode;

                VibrationalModes.get({
                    id: $scope.calcs[0]._id,
                    mode: $scope.mode
                }, function(data) {
                    $scope.viewer.stopAnimate();
                    $scope.animModel = null;
                    $scope.modeFrames = data.frames;
                });

                SDF.get({
                    id: $scope.calcs[0]._id
                },function(data) {
                    $scope.sdf = data.sdf;
                });
            });
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
