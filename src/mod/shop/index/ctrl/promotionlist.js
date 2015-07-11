/**
 * Created by Administrator on 2015/4/29.
 */
define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            F.title('优惠码')
            $scope.cusPromotions = {}
            $scope.num = 8
            //获取优惠码列表
            RQ.get('promocodes/cuspromocodes', {
                shop_id: G.user.ent_code,
                cus_code: G.user.id
            }, function (res) {
                $scope.total = res.total
                $scope.cusPromotions = res.cusPromoCodes
                console.log($scope.cusPromotions)
            })
            F.foot_fix($scope)
            F.show_index_nav($scope)

        }])
    }
})
