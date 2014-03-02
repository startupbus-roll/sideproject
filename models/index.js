var path = require('path'),
    basename = path.basename,
    fs = require('fs');

var models_dir = __dirname;
fs.readdirSync(models_dir).forEach(function (filename){
    if (!/\.js$/.test(filename))
        return;
    if (/index\.js$/.test(filename))
        return;
    var name = basename(filename, '.js');
    function load () {
        return require(models_dir + '/' + name);
    }
    exports.__defineGetter__(name, load);
});

