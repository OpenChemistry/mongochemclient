angular.module('mongochem.services')
    .service('mongochem.MoleculeFileUploadService', ['mongochem.girder.UploadService',
                                                     'mongochem.Molecule', 'mongochem.girder.Collection',
                                                     'mongochem.girder.Folder', 'mongochem.girder.User',
                                                     '$state', '$log', '$timeout', '$q',
        function(uploadService, Molecule, Collection, Folder, User,
                $state, $log, $timeout, $q) {

            this.upload = function(file) {
                return User.get().$promise.catch(
                        function(error) {
                            $log.error(error);
                        })
                // Now get the Private folder
                .then(function(userData) {
                    return Folder.query({text: 'Private',
                            parentType: 'user',
                            parentId: userData._id
                        }).$promise.catch(function(error) {
                            $log.error(error);
                    });
                 })
                 // Now we can do the upload
                 .then(function(folderData) {

//                     let updateMolecule = function(id) {
//                         Molecule.getByInchiKey({moleculeId: $state.params.moleculeId})
//                         .$promise.then(function(molecule) {
//                             if (!('logs' in molecule)) {
//                                 molecule.logs = [];
//                             }
//
//                             molecule.logs.push({_id: id});
//                             molecule.$update();
//                         }, function(error) {
//                             $log.error(error);
//                         });
//                     };

                     return uploadService.uploadFile('folder',
                             folderData[0]._id, file);
             });
        };
    }]);
