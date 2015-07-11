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
//            RQ.get("products.json", {}, function (res) {
//                //$scope.products_id = res.products
//                //console.log($scope.products_id)
//                angular.forEach(res.products, function (v, k) {
//                    $scope._post[k] = []
//                    angular.forEach(v, function (val, key) {
//                        var post_product = {}
//                        RQ.get('products/' + val, {}, function (res) {
//                            post_product.productID = res.productID
//                            post_product.productName = res.productName
//                            post_product.originalPrice = res.originalPrice
//                            post_product.salePrice = res.salePrice
//                            post_product.url = res.productImages[0].url
//                            post_product.firstTabName = res.firstTabName
//                            post_product.lastTabName = res.lastTabName
//                            $scope._post[k].push(post_product)
//                        })
//                    })
//                })
//                $scope.$watch('_post', function (_post) {
//                    if (res.products && F.json_length(res.products) == F.json_length(_post)) {
//                        $timeout(function () {
//                            console.log(_post)
//                            RQ.post('common/caches/set/allproducts_' + G.user.ent_code, _post, function (res) {
//                                console.log(res)
//                            })
//                        }, 20000)
//                    }
//                })
//            }, './site/')
//            //获取商品
//            RQ.get("product.json", {}, function (res) {
//                $scope.products=res.products
//                console.log($scope.products);
//                RQ.post('common/caches/set/products_' + G.user.ent_code, $scope.products, function (res) {
//                    //console.log(res)
//                })
//            },'./site/')
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