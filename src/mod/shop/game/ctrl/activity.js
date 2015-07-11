define(function (require, exports, module) {
    module.exports = function (app) {
        require('directive/shop/ctrl/pjCarousel')(app)
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            $scope.num = 0;
            $scope.pageNo = 0;
            $scope.limit = 10;
            $scope.res_products = {};
            //获取商品id并将所有产品post到缓存中
            $scope.post_products = {}
            $scope.post_product = {}
            $scope._post = {}
            $scope.images = G.site.index_slide||[]

            RQ.get('common/caches/get/allproducts_' + G.user.ent_code, {}, function (res) {
                if (res && res.errcode == 0 && res.data) {
                    var res_products = JSON.parse(res.data)
                    $scope.res_products = res_products
                } else {
                    F.tips("服务器异常，请重试", 1500)
                }
            })
            //$scope.vm = $routeParams
            //F.show_foot_nav($scope)
            F.foot_fix($scope)
            F.show_index_nav($scope)
            if(G.user.ent_code==100042.){
                F.show_ms_nav($scope)
            }

            //商品搜索跳转到searchList页面
            $scope.search = function (form_order) {
                //console.log(form_order)
                if(form_order){
                    var product_name = form_order.product_name
                    $location.url('/shop/index/searchList?product_name='+product_name)
                }else{
                    F.tips("请输入搜索关键字",1500)
                }
            }
        }])
    }
})