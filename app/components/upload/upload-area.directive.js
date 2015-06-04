var uploadAreaUrl = require('./upload-area.view.jade')

angular.module('mongochemApp')
.directive('mongochemUploadArea', [
    function() {
        return {
            link: function($scope, $element) {
                var areaDiv = angular.element($element.find('div')[0]);
                // Add drop event listeners
                $element.on('dragenter', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    areaDiv.addClass('mongochem-upload-area-drag');
                });

                $element.on('dragleave', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    areaDiv.removeClass('mongochem-upload-area-drag');
                });

                $element.on('dragover', function (e) {
                    e.preventDefault();
                });

                $element.on('drop', function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    let file = e.dataTransfer.files[0];

                    areaDiv.removeClass('mongochem-upload-area-drag');
                    console.log(file)

//                    if (file.name.endsWith('.xyz')) {
//                        let reader = new FileReader();
//
//                        reader.onload = function(e) {
//                            $scope.viewer.clear();
//                            $scope.viewer.addModel(e.target.result, 'xyz');
//                            $scope.viewer.setStyle({}, {stick:{}});
//                            $scope.viewer.zoomTo();
//                            $scope.viewer.render();
//                        };
//
//                        reader.readAsText(file);
//                    }
                });
            },
            templateUrl: uploadAreaUrl
       };
    }
 ]);