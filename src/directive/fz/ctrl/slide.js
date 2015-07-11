define(['frozen'],function (require, exports, module) {


    module.exports = function (app) {


        if(G.once_load.indexOf('directive/fz/ctrl/slide')===-1) {
            G.once_load.push('directive/fz/ctrl/slide')

            app.directive('fzSlide', ['$timeout', function ($timeout) {

                return {
                    restrict: "EA",
                    replace: true,
                    scope: {
                        imgs: '=',
                        opt: '=',
                        name: '@'
                    },
                    templateUrl: G.path.directive + '/fz/view/slide.html',
                    link: function (scope, element, attrs) {


                        var _opt = {
                            image: 'image',
                            url: 'url',
                            width: G.screen.width,
                            height: '',
                            title: 'title'
                        }


                        scope.$watch('imgs', function (imgs) {
                            if (angular.isArray(imgs) && imgs.length > 0) {

                                scope.name = scope.name || 'slider'
                                angular.extend(_opt, scope.opt)
                                //console.log(_opt)
                                scope.data = []
                                angular.forEach(scope.imgs, function (v, k) {
                                    scope.data.push({
                                        url: v[_opt.url],
                                        image: F.thumb_img(v[_opt.image], _opt.width, _opt.height),
                                        title: _opt.title && v[_opt.title] || false
                                    })
                                })

                                $timeout(function () {
                                    //$('#slider-'+scope.name).slider({loop:true,arrow:false});
                                    var slider = new fz.Scroll('#slider-' + scope.name, {
                                        role: 'slider',
                                        indicator: true,
                                        autoplay: true,
                                        interval: 2000
                                    });

                                })
                                return
                            }
                        })


                    }
                }
            }])
        }

    }
})