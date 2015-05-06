module.exports = function(source) {
    var get = /\$\.get\("http:\/\/3dmol\.csb\.pitt\.edu\/track\/report\.cgi"\);\n\n/g;
    source = source.replace(get, '')

    return source
};
