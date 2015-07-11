/**
 * Created by Administrator on 2015/4/29.
 */
define(function (require, exports, module) {
    module.exports = function(app){
        app.controller(app.cname,['$scope', '$routeParams', 'RQ', '$timeout', '$location',function ($scope, $routeParams, RQ, $timeout, $location) {
            F.title('优惠券详情')
            $scope.cusCoupons={}
            $scope.num=0

            F.foot_fix($scope)
            F.show_index_nav($scope)

            $scope.coupon_id=$routeParams.id
            $scope.cusCouponsDetail={}
            RQ.get('coupons/show_coupon',{
                coupon_id: $scope.coupon_id,
                cus_code:G.user.id
            },function(res){
                if(res.coupon){
                $scope.cusCouponsDetail=res.coupon;
                $scope.couponData=1
            }else{
                    $scope.couponData=0
                }
                //$scope.cusCouponsDetail.canReceive=1;
//                if(res.canReceive==0){
//                   // $scope.cusCouponsDetail.couponStatus="啊奥，优惠券被抢光了";
//                }else{
//                   // $scope.cusCouponsDetail.couponStatus="已领取";
//                }
            })
            $scope.receive=function( $couponID){
//                console.log(G.user.id);
//                console.log($couponID);
                RQ.post('coupons/receive', {
                    cusCode:G.user.id,
                    couponID:$couponID
                }, function (res) {
                    if(res&&res.errcode==0){
                        // window.location.href='#/shop/index/coupon';
                        $location.path('/shop/index/coupon');
                    }else{
                        F.tips('领取失败，请重试',1500)
                    }
                })
            }
        }])
    }
})
