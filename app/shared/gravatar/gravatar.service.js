var md5 = require("blueimp-md5");

angular.module('mongochem.services')
    .service('mongochem.GravatarService', function() {
        this.gravatarUrl = function(email) {
            var md5Sum = md5(email);

            return `https://www.gravatar.com/avatar/${md5Sum}?d=identicon&s=60`;
        };
    });