define(function (require, exports, module) {
    module.exports = function(app){
        require('directive/shop/ctrl/pjCarousel')(app)

        app.controller(app.cname,['$scope', '$routeParams', 'RQ', '$timeout', '$location',function ($scope, $routeParams, RQ, $timeout, $location) {
            $scope.pageNo = 0;
            $scope.limit = 10;
            $scope.num = 4;
            $scope.products = {};

            F.title()


            $scope.load_data = function(product_type){
                product_type = product_type||1
                //$scope.pageNo++;
                RQ.get("products/list_by_channel", {
                    shop_id:G.user.ent_code,
                    product_type:product_type,
                    //product_name: "",
                    //access_token:"ACCESS"
                   offset: 0,
                   limit: $scope.limit
                }, function(res){
                    if(res && res.errcode == 0){
                       // $scope.products[product_type] = $scope.products.concat(res.products);

                        $scope.products[product_type] = res.products
                    }
                })
            }

            $scope.images = G.site.index_slide||[]


            $scope.load_data(1)
            $scope.load_data(2)
            $scope.load_data(3)
            $scope.load_data(4)

            //$scope.vm = $routeParams

            //F.show_foot_nav($scope)
            F.foot_fix($scope)
            F.show_index_nav($scope)
        }])
    }
})