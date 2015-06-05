angular.module('mongochem.services')
    .service('mongochem.MoleculeFileUploadService', ['mongochem.girder.UploadService',
                                                     'mongochem.Molecule', 'mongochem.girder.Collection',
                                                     'mongochem.girder.Folder', 'mongochem.girder.User',
                                                     '$state', '$log',
        function(uploadService, Molecule, Collection, Folder, User,
                $state, $log) {

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
                     return uploadService.uploadFile('folder',
                             folderData[0]._id, file);
             });
        };
    }]);
