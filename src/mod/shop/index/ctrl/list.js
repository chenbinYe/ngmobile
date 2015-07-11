define(function (require, exports, module) {


    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            $scope.id = $routeParams.id || 0
            $scope.pageNo = 0;
            $scope.limit = 10;
            $scope.products = [];
            $scope.tag = 'all'
            $scope.headerPhoto = G.user.ent_code + $scope.tag
            $scope.channeld = $routeParams.channeld;
            $scope.listByChannel = function () {
                $scope.pageNo++;
                RQ.get("groups/show_products", {
                    ids: $scope.channeld,
                    offset: $scope.limit * ($scope.pageNo - 1),
                    limit: $scope.limit
                }, function (res) {
                    if (res && res.errcode == 0) {
                        $scope.products = $scope.products.concat(res.groupProducts[0].products);
                        $scope._disable_load = $scope.products.length == res.groupProducts[0].total ? true : false
                    } else {
                        $scope._disable_load = true
                        F.tips('没有更多数据了!', 1000)
                    }
                })
            }
            $scope.listByChannel()
            F.foot_fix($scope)
            F.show_index_nav($scope)
        }])

    }
})