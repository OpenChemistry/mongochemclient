angular.module('mongochemApp')
.directive('mongochemFilebrowseButton', [
    function() {
        return {
            scope: {
                'label': '@'
            },
            link: function($scope, $element) {
                // Little bit of hackery to get the filebrowser to come up
                var input = $element.find('input')[0];
                $element.find('button')[0].onclick = function() {
                    input.click();
                };

                input.onchange = function(evt) {
                    let files = evt.target.files;

                    if (files.length !== 0) {
                        uploadService.upload(files);
                    }
                };
            },
            templateUrl: require('./filebrowse.view.jade')

       };
    }
 ]);