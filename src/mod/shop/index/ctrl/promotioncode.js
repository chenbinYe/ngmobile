/**
 * Created by Administrator on 2015/4/29.
 */
define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            F.title('优惠码详情')
            $scope.cusPromotion = {}
            F.foot_fix($scope)
            F.show_index_nav($scope)
            $scope.promotion_id = $routeParams.id || 0
            $scope.cusPromotionDetail = {}
            RQ.get('promocodes/show_promocode/', {
                promocode_id: $scope.promotion_id,
                cus_code: G.user.id
            }, function (res) {
                if (res.errcode == 0 && res.promoCode) {
                    $scope.cusPromotion = res.promoCode;

                } else {
                    F.tips("服务器溜号去约会了！", 2000)
                }
            })
            $scope.receive = function ($promoCodeID) {
                RQ.post('promocodes/receive', {
                    cusCode: G.user.id,
                    cusName: G.user.name,
                    promoCodeID: $promoCodeID
                }, function (res) {
                    if (res && res.errcode == 0) {
                        // window.location.href='#/shop/index/coupon';
                        $location.path('/shop/index/promotionlist');
                    } else {
                        F.tips('领取失败，请重试', 1500)
                    }
                })
            }
        }])
    }
})
