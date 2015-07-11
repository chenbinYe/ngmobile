define(function (require, exports, module) {


    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            //$scope.product_name = $routeParams.product_name
            $scope.pageNo = 0;
            $scope.limit = 10;
            $scope.pageNo++;
            $scope.products = {}
            //商品查询
            $scope.find = function () {
                //console.log(name)
                RQ.get('products/list', {
                    shop_id: G.user.ent_code,
                    product_name: $routeParams.product_name,
                    offset: $scope.limit * ($scope.pageNo - 1),
                    limit: $scope.limit
                }, function (res) {
                    if (res && res.errcode == 0 && res.products.length > 0) {
                        //console.log(res.products)
                        $scope.products = res.products
                        $scope._disable_load = $scope.products.length == res.total ? true : false
                    } else {
                        $scope._disable_load = true
                        F.tips('没有更多数据了!',1000)
                    }
                })
            }
            $scope.find()
            F.foot_fix($scope)
            F.show_index_nav($scope)
        }])
    }
})