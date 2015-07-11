/**
 * Created by Administrator on 2015/5/8.
 */
define(function (require, exports, module) {


    module.exports = function (app) {
        app.directive('seckillRes', ['$timeout', function ($timeout) {

            return {
                restrict: "EA",
                transclude: true,
                replace: true,
                templateUrl: G.path.directive + '/shop/view/seckill-res.html',
                link: function (scope, element, attrs) {

                    $timeout(function () {

                    })
                }
            }
        }])

    }
})