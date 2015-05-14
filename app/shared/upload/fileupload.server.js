angular.module('mongochem.services')
    .service('mongochem.MoleculeFileUploadService', ['mongochem.girder.UploadService',
                                                     'mongochem.Molecule', 'mongochem.girder.Collection',
                                                     'mongochem.girder.Folder', '$state', '$log',
                                                     '$timeout', '$q',
        function(uploadService, Molecule, Collection, Folder,
                $state, $log, $timeout, $q) {

            this.upload = function(files) {
                // Make sure we have a collection
                Collection.query({text: 'Logs'}).$promise.catch(
                        function(error) {
                            $log.error(error);
                        })
               .then(function(data) {
                   let deferred = $q.defer();
                    if(data.length === 0) {
                        Collection.create({name: 'Logs'}).$promise.then(
                                function(data) {
                                    deferred.resolve(data._id);
                                },
                                function(error) {
                                    deferred.reject(error);
                                });
                    }
                    else {
                        $timeout(function() {
                            deferred.resolve(data[0]._id);
                        });
                    }

                    return deferred.promise;
                })
                // Now get the Private folder
                .then(function(parentId) {
                    return Folder.query({text: 'Private',
                            parentType: 'collection',
                            parentId: parentId
                        }).$promise.catch(function(error) {
                            $log.error(error);
                    });
                 })
                 // Now we can do the upload
                 .then(function(folderData) {

                     let updateMolecule = function(id) {
                         Molecule.getByInchiKey({moleculeId: $state.params.moleculeId})
                         .$promise.then(function(molecule) {
                             if (!('logs' in molecule)) {
                                 molecule.logs = [];
                             }

                             molecule.logs.push({_id: id});
                             molecule.$update();
                         }, function(error) {
                             $log.error(error);
                         });
                     };

                     let handleError = function(error) {
                         $log.error(error);
                     };

                     for(let i=0; i<files.length; i++) {
                         uploadService.uploadFile('folder',
                                 folderData[0]._id, files[i]).then(
                                         updateMolecule, handleError);
                     }
             });
        };
    }]);
