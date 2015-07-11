define(function (require, exports, module) {
    module.exports = function(app){
        require('directive/shop/ctrl/pjCarousel')(app)

        app.controller(app.cname,['$scope', '$routeParams', 'RQ', '$timeout', '$location',function ($scope, $routeParams, RQ, $timeout, $location) {
            $scope.pageNo = 0;
            $scope.limit = 10;
            $scope.num = 4;
            $scope.products = {};

            F.title("个人中心")
            $scope.images = G.site.index_slide||[]
            //F.show_foot_nav($scope)
//            F.foot_fix($scope)
//            F.show_index_nav($scope)
        }])
    }
})