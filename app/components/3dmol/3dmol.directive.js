var querySyntaxDialogUrl = require('../querysyntax/querysyntax.dialog.jade');

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

    $3Dmol.VolumeData.prototype.cjson = function(cjson) {
        this.size = new $3Dmol.Vector3(cjson.cube.dimensions[0],
                                       cjson.cube.dimensions[1],
                                       cjson.cube.dimensions[2]);
        this.origin = new $3Dmol.Vector3(cjson.cube.origin[0],
                                         cjson.cube.origin[1],
                                         cjson.cube.origin[2]);
        this.unit = new $3Dmol.Vector3(cjson.cube.spacing[0],
                                       cjson.cube.spacing[1],
                                       cjson.cube.spacing[2]);
        this.data = new Float32Array(cjson.cube.scalars);
    }

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
        .filter('mongochemFormatFormula', function() {
            return function(formula) {

                if (!formula) {
                    return "Not found";
                }

                var subChars = [ '\u2080', '\u2081', '\u2082', '\u2083',
                    '\u2084', '\u2085', '\u2086', '\u2087', '\u2088', '\u2089' ];

                var output = [];
                var isDigit = /[\d]{1}/;

                for (var i = 0; i < formula.length; i++) {
                    var c = formula[i];
                    if (isDigit.test(c)) {
                        output.push(subChars[parseInt(c)]);
                    }
                    else {
                        output.push(c);
                    }
                }
                return output.join('');
            };
        })
        .controller('mongochemMoleculeHome', ['mongochem.Molecule', 'mongochem.Calculations',
                                              'mongochem.VibrationalModes',
                                              'mongochem.MolecularOrbitals',
                                              'mongochem.Calculations.CJSON',
                                              '$scope', '$state', '$timeout', '$rootScope',
                                              function(Molecule, Calculations,
                                                       VibrationalModes, MolecularOrbitals,
                                                       CJSON, $scope, $state, $timeout, $rootScope) {

            // Set the default style
            $scope.style = {stick: {radius: 0.14}, sphere: {scale: 0.3}};
            $scope.experiments = [{
                name: 'Simulated'
            }];

            var fetchMolecule = function(inchikey) {
                if ($scope.loadedMoleculeKey) {
                    if ($scope.loadedMoleculeKey == inchikey) {
                        return;
                    }
                }
                $scope.loadedMoleculeKey = inchikey;

                $scope.mol = Molecule.getByInchiKey({moleculeId: inchikey}, function(mol) {
                    $scope.viewer.clear();
                    $scope.displayMolecule(mol, $scope.style);

                    // Fetch the calculations associated with this molecule
                    $scope.calcs = Calculations.query({moleculeId: mol._id}, function(calcs) {
                        if (calcs.length > 0) {
                            // Show the first vibrational modes for the first calculation
                            $scope.setCalculation(calcs[0]._id);
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
                    $scope.style = {stick: {radius: 0.14}, sphere: {scale: 0.3}};
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
                $scope.spectra.experiment = '';

                if ($scope.viewer) {
                    $scope.viewer.stopAnimate();
                }

                fetchMolecule(inchikey);
            };

	    $scope.displayMolecularOrbital = function(selectedMO) {
                MolecularOrbitals.get({
                    id: $scope.selectedCalculation._id,
		    mo: selectedMO
                }, function(data) {
                    $scope.cjson = data.cjson;
                    $scope.viewer.removeAllShapes();
		    $scope.volData = new $3Dmol.VolumeData(data.cjson, 'cjson');
                    $scope.viewer.addIsosurface($scope.volData, {isoval: 0.02,
                                                                 color: 'blue',
                                                                 alpha: 0.9,
                                                                 smoothness: 10});
                    $scope.viewer.addIsosurface($scope.volData, {isoval: -0.02,
                                                                 color: 'red',
                                                                 alpha: 0.9,
                                                                 smoothness: 10});
                    $scope.viewer.setStyle({}, $scope.style);
                    $scope.viewer.render();
                });
            };

            $scope.hasOrbitals = function() {
                return $scope.selectedCalculationType == 'Energy';
            };

            $scope.moSelected = function() {
                $scope.displayMolecularOrbital($scope.orbitals.mo);
            }

            $scope.displayCalculation = function() {
                if ($scope.loadedCalculationId) {
                    if ($scope.loadedCalculationId == $scope.selectedCalculation._id) {
                        return;
                    }
                }
                $scope.loadedCalculationId = $scope.selectedCalculation._id;

                CJSON.get({
                    id: $scope.selectedCalculation._id
                }, function(data) {
                    $scope.viewer.removeAllModels();
                    $scope.cjson = data.cjson;
                    $scope.viewer.addModel($scope.cjson, 'cjson');
                    $scope.viewer.setStyle({}, $scope.style);
                    $scope.viewer.zoomTo();
                    $scope.viewer.render();
		    // Figure out what types of data the molecule contains
                    $scope.calculationTypes = [];
                    $scope.selectedCalculationType = null;
                    $scope.orbitals = null;
                    if ($scope.cjson.vibrations) {
                        $scope.calculationTypes.push('Vibrational');
                        if (!$scope.selectedCalculationType) {
                            $scope.selectedCalculationType = 'Vibrational';
                        }
                    }
                    if ($scope.cjson.basisSet) {
                        var showAnOrbital = false;
                        $scope.calculationTypes.push('Energy');
                        if (!$scope.selectedCalculationType) {
                            $scope.selectedCalculationType = 'Energy';
			    $scope.vibrationalModes = null;
                            showAnOrbital = true;
                        }
                        $scope.orbitals = {};
                        $scope.orbitals.electronCount = $scope.cjson.basisSet.electronCount;
                        $scope.orbitals.mos = [];
                        for (let i = 0; i < $scope.orbitals.electronCount; ++i) {
                            let text = '';
                            if (i == $scope.orbitals.electronCount / 2) {
                                text = ' (HOMO)';
                            }
                            else if (i == $scope.orbitals.electronCount / 2 + 1) {
                                text = ' (LUMO)';
                            }
                            let moObj = { id: i, text: i + text };
                            $scope.orbitals.mos.push(moObj);
                        }
                        $scope.orbitals.mo = $scope.orbitals.electronCount / 2;
                        if (showAnOrbital) {
                            $scope.displayMolecularOrbital($scope.orbitals.mo);
                        }
                    }
                });
            };

            $scope.setCalculationType = function(calcType) {
                $scope.viewer.removeAllShapes();
                $scope.viewer.stopAnimate();
                $scope.viewer.render();
                console.log('calculation type changes to ' + calcType);
                if (calcType == 'Energy') {
                    $scope.showFrequenciesHistogram = false;
                    $scope.vibrationalModes = null;
                    $scope.displayMolecularOrbital($scope.orbitals.mo);
                }
                else {
                    $scope.showFrequenciesHistogram = true;
                    $scope.vibrationalModes = $scope.cjson.vibrations;
                }
            };

            $scope.setCalculation = function(id) {
                $scope.animModel = null;
                $scope.modeFrames = null;
                $scope.sdf = null;
                $scope.spectra.mode = null;
                $scope.spectra.experiment = '';

                if ($scope.viewer) {
                    $scope.viewer.stopAnimate();
                }

                for (let i = 0; i < $scope.calcs.length; ++i) {
                    if ($scope.calcs[i]._id == id) {
                        $scope.selectedCalculation = $scope.calcs[i];
                        $scope.vibrationalModes = $scope.calcs[i].vibrationalModes;
                        // Update the geometry to use the calculation geometry
                        $scope.displayCalculation();
                        return;
                    }
                }
            };

            $scope.showMolecule = function() {
                $state.go('molecule', {moleculeId: $scope.selectedMolecule.inchikey });
            };

            $scope.hasAnimation = function() {
                return $scope.modeFrames && $scope.cjson;
            };

            $scope.hasSpectra = function() {
                if ($scope.selectedCalculationType) {
                    return $scope.vibrationalModes && $scope.selectedCalculationType == 'Vibrational';
                }
                else {
                    return $scope.vibrationalModes;
                 }
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
            var dereg2 = $scope.$watch('selectedCalculation', function(selectedCalculation) {
                if (selectedCalculation) {
                    $scope.setCalculation(selectedCalculation._id);
                    // ng-change will takeover now
                    dereg2();
                }
            });

            $scope.showFrequenciesHistogram = true;

            $scope.toggleFrequencies = function() {
                $scope.showFrequenciesHistogram = !$scope.showFrequenciesHistogram;
            };

            $scope.animateMode = function(mode) {
                // Cancel any existing animation loop
                $scope.viewer.stopAnimate();

                // Generate the frames and animate the model once ready.
                $scope.modeFrames = $scope.generateFrames(mode);
                $scope.animModel = null;
                // Ensure we don't start two animation timers, use timeout.
                $timeout($scope.animateMolecule, 100);
            };

            $scope.modeSelected = function() {
                $rootScope.$broadcast('mongochem-frequency-histogram-selectbar', $scope.spectra.mode - 1);
                $scope.animateMode($scope.spectra.mode);
            };

            $scope.experimentSelected = function() {
                $scope.vibrationalModes.simulateExperimental = $scope.spectra.experiment === 'Simulated';
            };

            $scope.openDownloadMenu = function($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            $scope.$on('mongochem-frequency-histogram-clickbar', function(evt, data) {
                $scope.animateMode(data.mode);
            });

            $scope.$watch('molecules', function(molecules) {
                if (molecules) {
                    let selectedMolecule = null;
                    for (let i=0; i<molecules.length; i++) {
                        if ($scope.selectedMolecule && $scope.selectedMolecule.id === molecules[i].id) {
                            selectedMolecule = molecules[i];
                            break;
                        }
                    }

                    if (!selectedMolecule && molecules.length > 0) {
                        selectedMolecule = molecules[0];
                    }

                    // If we have nothing selected reset everything
                    if (!selectedMolecule) {
                        $scope.selectedMolecule = null;
                        $scope.spectra.mode = null;
                        $scope.spectra.experimental = null;
                        $scope.mol = null;
                        $scope.modeFrames = null;
                        $scope.sdf = null;
                        $scope.vibrationalModes = null;
                        $scope.animModel = null;

                        if ($scope.viewer) {
                            $scope.viewer.clear();
                        }

                        $rootScope.$broadcast('mongochem-frequency-histogram-selectbar', -1);
                    }
                    else if (!$scope.selectedMolecule || selectedMolecule.id != $scope.selectedMolecule.id)  {
                        $scope.setInchiKey(selectedMolecule.inchikey);
                    }
                    $scope.selectedMolecule = selectedMolecule;
                }
            });
        }])
        .controller('mongochemMoleculeDetail', ['mongochem.Molecule', '$scope', '$stateParams', function(Molecule, $scope, $stateParams) {
            $scope.mol = Molecule.getByInchiKey({moleculeId: $stateParams.moleculeId}, function(mol) {
                $scope.displayMolecule(mol , $scope.style);
            });
        }])
        .controller('mongochemMolecules', ['Molecules', '$scope', '$rootScope', '$http', '$q', '$mdDialog', function(Molecules, $scope, $rootScope, $http, $q, $mdDialog) {
            $scope.search = {valid: true};
            $scope.molecules = null;

            function updateMolecules(molecules) {
                molecules.sort(function(a, b) {
                    return a.name.toLowerCase() > b.name.toLowerCase();
                });
                $scope.molecules = molecules;
            }

            function fetchMolecules() {
                Molecules.query({}, function(molecules) {
                    updateMolecules(molecules);
                });
            }

            fetchMolecules();
            // Fetch the molecule list again if one has been added
            $rootScope.$on('mongochem-molecule-created', function() {
                fetchMolecules();
            });

            function processQuery(query) {
                var replaceMap = {
                    '~' : '~slr~',
                    '>=' : '~gte~',
                    '<=' : '~lte~',
                    '<' : '~lt~',
                    '>' : '~gt~',
                    '!=' : '~ne~',
                    '&' : '~and~',
                    '|' : '~or~'
                };

                // If the the user has typed an inchi the run inchi=* query
                if (/^InChI=.*/.test(query)) {
                    query = 'inchi='+query;
                }

                // Strip of prefix
                query = query.replace('InChI=', '');

                for ( let op in replaceMap) {
                    query = query.replace(op, replaceMap[op]);
                }

                // SMILES can have = in them
                if (!/^\s*smiles\s*~.*/.test(query)) {
                    query = query.replace('=', '~eq~');
                }

                return query;
            }



            function search() {
                let queryString = processQuery($scope.search.queryString);

                if ($scope.canceller) {
                    $scope.canceller.resolve();
                }

                $scope.canceller = $q.defer();

                $scope.currentQuery = $http.get('api/v1/molecules/search', {
                    params: {
                        q: queryString
                    },
                    timeout: $scope.canceller.promise
                }).then(function(response) {
                    $scope.search.valid = true;
                    updateMolecules(response.data);
                }, function(errorResponse) {
                    // The request was cancelled
                    if (errorResponse.status === -1) {
                        return;
                    }
                    $scope.search.valid = false;
                    updateMolecules([]);
                });
            }

            $scope.$watch('search.queryString', function(newValue, oldValue) {

                if (typeof newValue === 'undefined' || newValue === oldValue) {
                    return;
                }

                if (newValue.length === 0) {
                    fetchMolecules();
                    $scope.search.valid = true;
                }
                else {
                    search();
                }
            });

            $scope.showQueryHelpDialog = function(evt) {
                $mdDialog.show({
                    templateUrl: querySyntaxDialogUrl,
                    targetEvent: evt,
                    clickOutsideToClose: true
                });
            };
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
