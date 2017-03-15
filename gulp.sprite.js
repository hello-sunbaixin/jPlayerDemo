/**
 * Created by jovi on 2017/1/16.
 */

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var extend = require('extend');
var merge = require('merge-stream');

var spritesmith = require('gulp.spritesmith');

var sourcePath = './src';
var buildPath = './build';
var tempPath = './temp';

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

module.exports = function() {
    var spritePathOut = sourcePath + '/assets/sprite';
    var foldersOut = getFolders(spritePathOut);
     var tasks='';
    foldersOut.map(function(folderOut) {
        var spritePath = sourcePath + '/assets/sprite/'+folderOut;
        var folders = getFolders(spritePath);

        // console.log(folders);
         tasks = folders.map(function(folder) {
            // console.log(folder);
            var spriteName = 'sprite_'+folderOut+'_' + folder;
            var spriteSetting = {
                    imgName: spriteName + '.png',
                    cssName: spriteName + '.less',
                    padding: 5,
                    cssFormat: 'less',
                    cssTemplate: 'sprite.template.mustache',
                    cssSpritesheetName: spriteName,
                    cssHandlebarsHelpers: {
                        spriteName: function(res) {
                            var sprite = res.data.root.sprites[res.data.index],
                                reg = new RegExp(spriteName.replace(/_/g, '/') + '(.*)\/' + sprite.name),

                                subDir = sprite.source_image.replace(/\\/g, '/').match(reg)[1];
                            // console.log(reg);

                            return spriteName + (subDir && subDir.split('\/').join('_'));
                        }
                    }
                },
                cfg;

            try {
                cfg = require(spritePath + '/' + folder + '/config.js');
                console.log(cfg);
                spriteSetting = extend({}, spriteSetting, cfg);
                // console.log(spriteSetting);
            } catch (e) {}

            return gulp.src([folder + '/**/*.png'], { cwd: spritePath, base: spritePath })
                .pipe(spritesmith(spriteSetting))
                .pipe(gulp.dest(spritePath));
        });
    })


    return merge(tasks);
}
