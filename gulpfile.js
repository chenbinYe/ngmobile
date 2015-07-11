/**
 * Created by Game-netease on 2014/9/17.
 */
//引入插件
var gs = {}
gs.gulp = require('gulp');
gs.connect = require('gulp-connect');
gs.less = require('gulp-less');
gs.cssmin = require('gulp-cssmin');
gs.rename = require('gulp-rename');
gs.path = require('path');
//
gs.htmlreplace = require('gulp-html-replace');
gs.minifyHTML = require('gulp-minify-html');
//
gs.htmlmin = require('gulp-htmlmin');
//
gs.uglify = require('gulp-uglify');
gs.ngmin = require('gulp-ngmin');
gs.ngannotate =require('gulp-ng-annotate');
//gs.clean = require('gulp-clean');

gs.from = './src/'
gs.to = './build/'
gs.root = __dirname
//var today = new Date().Format("yyyy-MM-dd HH:mm:ss");



Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
gs.version = new Date().Format("yyyy-MM-dd hh:mm");


require('./tool/paijia')(gs)

//
/*require('./tool/enterprise')(gs)
require('./tool/zone')(gs)
require('./tool/library')(gs)

gs.gulp.task('server', function () {
    gs.connect.server({
        root: ['./'],
        port: 88,
        livereload: true
    });
});

gs.gulp.task('all', ['lib','eb','zb']);
gs.gulp.task('default', ['server']);*/

