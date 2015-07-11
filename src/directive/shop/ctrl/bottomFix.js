define(function (require, exports, module) {


    module.exports = function (app) {
        app.directive('bottomFix', ['$timeout', function ($timeout) {

            return {
                restrict: "EA",
                transclude: true,
                replace: true,
                templateUrl: G.path.directive + '/shop/view/bottom-fix.html',
                link: function (scope, element, attrs) {
                    $timeout(function () {


                    })

                    scope.show_sku = 0
                    scope.show_sku_layout = 0
                    scope.ctrl_sku = function (opt) {
                        scope.show_sku = opt
                        $timeout(function () {
                            scope.show_sku_layout = opt
                        }, 100)
                    }

                    scope.ctrl_sku_close = function (opt) {
                        scope.show_sku_layout = opt
                        $timeout(function () {
                            scope.show_sku = opt
                        }, 300)
                    }

                    F.detal = {}
                    F.detal.ctrl_sku_close = scope.ctrl_sku_close


                }
            }
        }]).directive('skuLayout', ['$timeout', function ($timeout) {

            return {
                restrict: "EA",
                transclude: true,
                replace: true,
                templateUrl: G.path.directive + '/shop/view/sku-layout.html',
                link: function (scope, element, attrs) {
                    $timeout(function () {


                    })


                    scope.select_sku = function (item, $index) {

                        scope.sku_key[$index] = item
                        var _key = scope.sku_key.join('#')
                        scope.sku_value = angular.copy(scope.sku.value[_key])
                        scope.order.key = _key
                        scope.order.skuID = scope.sku.value[_key].skuID;
                    }

                    scope.set_order = function (plus) {
                        console.log(scope.sku_value)
                        if (plus && scope.sku_value.num && scope.order.num < scope.sku_value.num) {
                            scope.order.num++
                        } else if (scope.order.num > 0 && !plus) {
                            scope.order.num--
                        }
                    }


                    scope.check_quantity = function (good) {
                        if (good.num > scope.sku_value.num) {
                            good.num = angular.copy(scope.sku_value.num)
                        } else if (good.num < 0) {
                            good.num = 0
                        }
                    }


                }
            }
        }])

    }
})