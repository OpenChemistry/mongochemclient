angular.module('mongochemApp')
.directive('mongochemFilebrowseButton', [
    function() {
        return {
            scope: {
                'label': '@',
                'action': '='
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
                        $scope.action(files[0]);
                    };
                }
            },
            templateUrl: require('./filebrowse.view.jade')

       };
    }
 ]);