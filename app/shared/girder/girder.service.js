angular.module('mongochem.services')
    .factory('mongochem.girder.Collection', ['$resource',
        function($resource){
            return $resource('api/v1/collection', {}, {
                query: {method:'GET', isArray:true},
                create: {url: 'api/v1/collection', params: {name: '@name'}, method: 'POST'}
            });
    }])
    .factory('mongochem.girder.Folder', ['$resource',
        function($resource){
            return $resource('api/v1/folder', {}, {
                query: {url: 'api/v1/folder', params: {},
                    method:'GET', isArray:true}
            });
    }])
    .service('mongochem.girder.UploadService', ['$http', '$rootScope', '$q',  function($http, $rootScope, $q) {

        this.post = function (url, data, config) {
            return $http.post(`api/v1/${url}`, data, config);
        };

        this.uploadChunk = function (uploadId, offset, blob) {
            let formdata = new FormData();
            formdata.append('offset', offset);
            formdata.append('uploadId', uploadId);
            formdata.append('chunk', blob);

            return this.post('file/chunk', formdata, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            });
        };

        this.uploadFile = function (parentType, parentId, file, opt) {
            let deferred = $q.defer();

            let that = this;

            opt = opt || {};

            this.post(['file',
                       '?parentType=', parentType,
                       '&parentId=', parentId,
                       '&name=', opt.name || file.name,
                       '&size=', file.size,
                       '&mimeType=', file.type].join(''))
                .success(function (upload) {
                    let chunkSize = 16*1024*1024,
                        uploadNextChunk,
                        i = 0,
                        chunks = Math.floor(file.size / chunkSize);

                    // Notify that upload started
                    $rootScope.$broadcast('notification-message', {
                        type: 'upload',
                        file: file.name,
                        done: 0,
                        total: chunks
                    });

                    uploadNextChunk = function (offset) {
                        let blob;

                        if (offset + chunkSize >= file.size) {
                            blob = file.slice(offset);
                            that.uploadChunk(upload._id, offset, blob)
                                .success(function (data) {
                                    $rootScope.$broadcast('file-uploaded', parentId, data);
                                    $rootScope.$broadcast('notification-message', null);
                                    deferred.resolve(data._id);
                                })
                                .error(function (data) {
                                    deferred.reject(data);
                                });
                        } else {
                            blob = file.slice(offset, offset + chunkSize);
                            that.uploadChunk(upload._id, offset , blob)
                                .success(function () {
                                    let msg;

                                    i += 1;
                                    msg = 'chunk ' + i + ' of ' + chunks + ' uploaded';

                                    $rootScope.$broadcast('notification-message', {
                                        type: 'upload',
                                        file: file.name,
                                        done: i,
                                        total: chunks
                                    });

                                    uploadNextChunk(offset + chunkSize);
                                })
                                .error(function (data) {
                                    deferred.reject(data);
                                });
                        }
                    };

                    uploadNextChunk(0);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };
    }]);