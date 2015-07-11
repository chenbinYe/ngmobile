define(function (require, exports, module) {


    module.exports = function (app) {


        require('plugin/carousel')
        G.loaded_directive = G.loaded_directive||[]
        if(G.loaded_directive.indexOf('pjCarousel')===-1) {
            G.loaded_directive.push('pjCarousel')
            app.directive('pjCarousel', ['$timeout', function ($timeout) {

                return {
                    restrict: "EA",
                    //transclude:true,
                    replace: true,
                    templateUrl: G.path.directive + '/shop/view/pj-carousel.html',
                    scope: {
                        images: '=',
                        local: '=',
                        elm: '@'
                    },
                    link: function (scope, element, attrs) {
                        //product.productImages
                        //console.log(scope.images)
                        scope.elm = scope.elm || ''
                        var elm = (scope.elm) && '#' + scope.elm || '.swiper-container'
                        scope.$watch('images', function (imgs) {
                            if (angular.isArray(imgs) && imgs.length > 0) {
                                $timeout(function () {
                                    var swiper = new Swiper(elm, {
                                        pagination: '.swiper-pagination',
                                        paginationClickable: true
                                    });

                                })
                                return
                            }
                        })

                        if (!scope.local) {
                            scope.get_image = F.get_image
                        } else {
                            scope.get_image = function (url) {
                                return url
                            }
                        }


                    }
                }

            }])
        }


    }
})