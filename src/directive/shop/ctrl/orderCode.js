/**
 * Created by Rory on 2015/6/8.
 */
define(function (require, exports, module) {


    module.exports = function (app) {
        app.directive('orderCode', ['$timeout', function ($timeout) {

            return {
                restrict: "EA",
                transclude: true,
                replace: true,
                templateUrl: G.path.directive + '/shop/view/order-code.html',
                link: function (scope, element, attrs) {

                    $timeout(function () {

                    })
                }
            }
        }])

    }
})