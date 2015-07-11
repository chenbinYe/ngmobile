/**
 * Created by Game-netease on 2014/11/3.
 */


module.exports = function(gs){




   /* gs.gulp.task('clean', function () {
        return gs.gulp.src(gs.root+'/build/', {read: false})
            .pipe(gs.clean());
    });*/

    gs.gulp.task('less', function() {
        gs.gulp.src(gs.root+'/static/less/style.less')
            .pipe(gs.less())
            .pipe(gs.cssmin())
            .pipe(gs.rename('style.css'))
            .pipe(gs.gulp.dest(gs.root+'/build/static/css'))

    })

    gs.gulp.task('site', function() {
        gs.gulp.src([gs.root+'/site/*.js'])
            .pipe(gs.uglify(jsminOpt))
            .pipe(gs.gulp.dest(gs.root+'/build/site/'))

    })

    //html 配置
    var opts = {
        empty: true,
        spare: true,
        quotes: true,
        collapseWhitespace: true,
        removeComments:true,
        minifyJS: true
    }

/*    var opts = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    }*/

    //js 压缩配置
    var jsminOpt = {mangle: {except: ['define', 'require', 'module', 'exports']}}

    gs.gulp.task('index', function() {
            console.log(opts)
        gs.gulp.src(gs.root + '/index.html')
            .pipe(gs.htmlreplace({
                'less': [
                    'static/css/style.css'
                ]
            }))
            .pipe(gs.htmlmin(opts))
            .pipe(gs.gulp.dest(gs.root + '/build'))
    })

    gs.gulp.task('htmlmin', function() {
        gs.gulp.src([gs.root + '/src/mod/*/view/*.html',gs.root + '/src/mod/*/*/view/*.html'])
            .pipe(gs.htmlmin(opts))
            .pipe(gs.gulp.dest(gs.root + '/build/src/mod'))

        gs.gulp.src([gs.root + '/src/public/view/*.html'])
            .pipe(gs.htmlmin(opts))
            .pipe(gs.gulp.dest(gs.root + '/build/src/public/view'))

        gs.gulp.src([gs.root + '/src/directive/*/view/*.html', gs.root + '/src/directive/*/*/view/*.html'])
            .pipe(gs.htmlmin(opts))
            .pipe(gs.gulp.dest(gs.root + '/build/src/directive'))

    })

    gs.gulp.task('lib', function() {
        gs.gulp.src([gs.root + '/src/lib/*',gs.root + '/src/lib/*/*'])
            .pipe(gs.uglify(jsminOpt))
            .pipe(gs.gulp.dest(gs.root + '/build/src/lib'))
    })

    gs.gulp.task('static', function() {
        gs.gulp.src([gs.root + '/static/image/*/*/*/*'])
            .pipe(gs.gulp.dest(gs.root + '/build/static/image'))

        gs.gulp.src([gs.root + '/static/image/*/*/*'])
            .pipe(gs.gulp.dest(gs.root + '/build/static/image'))

        gs.gulp.src([gs.root + '/static/image/*/*'])
            .pipe(gs.gulp.dest(gs.root + '/build/static/image'))

        gs.gulp.src([gs.root + '/static/image/*'])
            .pipe(gs.gulp.dest(gs.root + '/build/static/image'))

        gs.gulp.src([gs.root + '/favicon.ico'])
            .pipe(gs.gulp.dest(gs.root + '/build'))
    })

    gs.gulp.task('js', function() {

        //app js
        gs.gulp.src([gs.root + '/src/app/*.js'])
            .pipe(gs.uglify(jsminOpt))
            .pipe(gs.gulp.dest(gs.root + '/build/src/app'))

        //load
        gs.gulp.src([gs.root + '/src/load.js'])
            .pipe(gs.uglify(jsminOpt))
            .pipe(gs.gulp.dest(gs.root + '/build/src'))

        //mod js
        gs.gulp.src([gs.root + '/src/mod/*/ctrl/*.js', gs.root + '/src/mod/*/*/ctrl/*.js'])
            .pipe(gs.uglify(jsminOpt))
            .pipe(gs.gulp.dest(gs.root + '/build/src/mod'))

        //directive
        gs.gulp.src([gs.root + '/src/directive/*/ctrl/*.js'])
            .pipe(gs.uglify(jsminOpt))
            .pipe(gs.gulp.dest(gs.root + '/build/src/directive'))

    })



    gs.gulp.task('pjall', ['less','index','site','htmlmin','lib','static','js']);
    gs.gulp.task('pj', ['less','index','site','htmlmin','js']);
}