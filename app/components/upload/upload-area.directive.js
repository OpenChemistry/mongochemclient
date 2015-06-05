var uploadAreaUrl = require('./upload-area.view.jade');

angular.module('mongochemApp')
.directive('mongochemUploadArea', [
    function() {
        return {
            link: function($scope, $element) {
                $scope.drop = false;

                var areaDiv = angular.element($element.find('div')[0]),
                    dragCount = 0;

                // Add drop event listeners
                $element.on('dragenter', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    $scope.drop = true;
                    $scope.$apply();
                    areaDiv.addClass('mongochem-upload-area-drag');
                    dragCount++;
                });

                $element.on('dragleave', function(e) {
                    dragCount--;

                    if (dragCount === 0) {
                        $scope.drop = false;
                        $scope.$apply();
                        areaDiv.removeClass('mongochem-upload-area-drag');
                    }
                    e.stopPropagation();
                    e.preventDefault();
                });

                $element.on('dragover', function (e) {
                    e.preventDefault();
                });

                $element.on('drop', function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    let file = e.dataTransfer.files[0];

                    areaDiv.removeClass('mongochem-upload-area-drag');

                    $scope.uploadFile(file);
                });
            },
            templateUrl: uploadAreaUrl
       };
    }
 ]);