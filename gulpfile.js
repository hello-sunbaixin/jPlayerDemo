/**
 * Created by jovi on 2016/12/17.
 */
var gulp = require('gulp');
var clean = require('gulp-clean');
var cleanCss = require('gulp-clean-css');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var replace = require('gulp-replace');
var htmlreplace = require('gulp-html-replace');
var exec = require('child_process').exec;
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var opn = require('opn');

var sourcePath = './src';
var buildPath = './build';
var tempPath = './temp';
// 根据不同需求配置不同上线路径
var config = require('./gulp.path.config')['esfDetail']['online'];
var serverConfig = {
    root: './', //设置根目录
    livereload: true, //启动实施监控
    port: 8080, //设置端口
    name: 'Dev App', //设置服务器名字
    domain: 'localhost'
};

gulp.task('clean', function () {
    gulp.src([buildPath + '/*', tempPath + '/*'])
        .pipe(clean());
});

//less编译
// gulp.task('less', function(){
//     gulp.src(['pages/**/*.less'], { cwd: sourcePath, base: sourcePath })
//         .pipe(less({
//             relativeUrls: true
//         }))
//         .pipe(gulp.dest(sourcePath));
// });


//less编译
// gulp.task('less', ['spritesmith'], function(){
//     gulp.src(['pages/**/*.less'], { cwd: sourcePath, base: sourcePath })
//         .pipe(less({
//             relativeUrls: true
//         }))
//         .pipe(gulp.dest(sourcePath));
// });
gulp.task('less', function(){
    gulp.src(['pages/**/*.less'], { cwd: sourcePath, base: sourcePath })
        .pipe(less({
            relativeUrls: true
        }))
        .pipe(gulp.dest(sourcePath));
});
// 生成sprite
gulp.task('spritesmith', require('./gulp.sprite'));

//压缩css
gulp.task('minify-css', function(){
    gulp.src(['pages/**/*.css'], { cwd: tempPath, base: tempPath })
        .pipe(cleanCss({
            compatibility: 'ie8'
        }))
        // .pipe(replace(/url\(\S*\/(\w+.(png|jpg|bmp|gif))\)/,'url('+config.imgSvnPath+'$1'+')'))
        .pipe(replace('../../assets/sprite/esf-list/sprite_esf-list_icon1x.png','http://img.58cdn.com.cn/fangrs/pc-site/esf/sprite_esf-list_icon1x.png'))
        // .pipe(rev())
        // .pipe(gulp.dest(buildPath))
        // .pipe(rev.manifest())
        .pipe(gulp.dest(buildPath));
});

//压缩js
gulp.task('uglify', function(){
    gulp.src(['*.js', 'pages/**/*.js'], { cwd: tempPath, base: tempPath })
       .pipe(uglify({
            mangle: false//类型：Boolean 默认：true 是否修改变量名
            // compress: true,//类型：Boolean 默认：true 是否完全压缩
            // preserveComments: all //保留所有注释
        }))
        // .pipe(uglify())
        .pipe(gulp.dest(buildPath));
});
// gulp.task('uglify', function(){
//     gulp.src(['pages/esf/*.js'], { cwd: tempPath, base: tempPath })
//        // .pipe(uglify({
//        //      //mangle: false//类型：Boolean 默认：true 是否修改变量名
//        //      // compress: true,//类型：Boolean 默认：true 是否完全压缩
//        //      // preserveComments: all //保留所有注释
//        //  }))
//         .pipe(uglify())
//         .pipe(gulp.dest(buildPath));
// });

//项目r.js打包
gulp.task('rjs', ['clean'], function(cb){
    exec('node ./node_modules/requirejs/bin/r.js -o require.build.js', function(err) {
        // console.log(err);
        if (err) return cb(err);
        cb();
    });
});

gulp.task('rs', function(){
   gulp.src(['**/*.js', '**/*.css', '**/*.html'], { cwd: sourcePath, base: sourcePath })
       .pipe(connect.reload());
});

//监听静态资源
gulp.task('watch', function () {

    gulp.watch(['**/**/*.less'], { cwd: sourcePath, base: sourcePath }, ['less']);

    gulp.watch(['**/**/*.js', '**/**/*.css', '**/**/*.html'], { cwd: sourcePath, base: sourcePath }, ['rs']);
});
// 连接服务器
gulp.task('g-connect', function() {
    connect.server({
        root: serverConfig.root, //设置根目录
        livereload: serverConfig.livereload, //启动实施监控
        port: serverConfig.port, //设置端口
        name: serverConfig.name //设置服务器名字
    });

});
//
gulp.task('g-openbrowser', function() {
    opn('http://' + serverConfig.domain + ':' + serverConfig.port,{app: ['chrome']});
});
// gulp.task('server', ['watch'], function(){
//     connect.server({
//         port: 3000,
//         livereload: true,
//         host: 'dev.58.com'
//     });
// });
gulp.task('default', ['g-connect', 'watch', 'g-openbrowser']);
gulp.task('build', ['rjs'], function(){
    gulp.start('uglify', 'minify-css');

    gulp.src(['pages/**/*.html'], { cwd: sourcePath, base: sourcePath })
        .pipe(htmlreplace({
            script: {
                src: [[config.jsSvnPath,config.globalSvnPath,config.baseSvnPath]],
                tpl: '<script data-main="%s" src="%s"></script><script src="%s"></script>'
            },
            css:{
                src:[[config.cssSvnPath]],
                tpl: '<link rel="stylesheet" href="%s"/>'
            }
        }))
        // .pipe(replace(/(\n?)([ \t]*)(<!--\s*note:(\w+(?:-\w+)*)\s*-->)\n?([\s\S]*?)\n?(<!--\s*notebuild\s*-->)\n?/ig,'124'+'$1'+'$2'))
        .pipe(gulp.dest(buildPath));
});

// gulp.task('default', ['server']);


