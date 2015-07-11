define(function (require, exports, module) {
    module.exports = function (app) {
        require('directive/shop/ctrl/pjCarousel')(app)
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            $scope.pageNo = 0;
            $scope.res_products = {};
            $scope.images = G.site.index_slide || []
            $scope.ids = ""
            if (G.user.ent_code == 100038) {
//                $scope.ids = "1,2,3,4,5,6,8"
                $scope.limit = 20;
            }
            if (G.user.ent_code == 100042) {
//                $scope.ids = "9,10,13,15"
                $scope.limit = 2;
            }
            $scope.get_group = function () {
                RQ.get("groups/get_children", {
                    shop_id: G.user.ent_code,
                    parent_id: 0
                }, function (res) {
                    if (res && res.errcode == 0) {
                        angular.forEach(res.groups, function (v, k) {
                            $scope.ids = $scope.ids + ',' + v.groupID //获取分组id
                        })
                        $scope.products_data()
                    } else {
                        F("服务器异常，请重试", 1500)
                    }
                })
            }
            $scope.products_data = function () {
                RQ.get("groups/show_products", {
                    ids: $scope.ids,
                    offset: 0,
                    limit: $scope.limit
                }, function (res) {
                    if (res && res.errcode == 0) {
                        $scope.res_products = res.groupProducts;
                    }
                })
            }
            F.foot_fix($scope)
            F.show_index_nav($scope)
            $scope.get_group()
            //商品搜索跳转到searchList页面
            $scope.search = function (form_order) {
                //console.log(form_order)
                if (form_order) {
                    var product_name = form_order.product_name
                    $location.url('/shop/index/searchList?product_name=' + product_name)
                } else {
                    F.tips("请输入搜索关键字", 1500)
                }
            }
        }])
    }
})