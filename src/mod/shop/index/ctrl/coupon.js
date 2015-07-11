/**
 * Created by Administrator on 2015/4/29.
 */
define(function (require, exports, module) {
    module.exports = function(app){
        app.controller(app.cname,['$scope', '$routeParams', 'RQ', '$timeout', '$location',function ($scope, $routeParams, RQ, $timeout, $location) {
            F.title('优惠券')
            $scope.cusCoupons={}
            $scope.num=0
            var nowdate= new Date().valueOf()
            RQ.get('coupons/cuscoupons',{
                shop_id:G.user.ent_code,
                cus_code:G.user.id
            },function(res){
                $scope.total = res.total;
                $scope.cusCoupons=res.cusCoupons;
            })


            F.foot_fix($scope)
            F.show_index_nav($scope)

            $scope.getdate=function(cusCoupon){
                //console.log((cusCoupon.endTime-nowdate)/(1000 * 60 * 60 * 24))
                //console.log(cusCoupon);
                //var t =cusCoupon.endTime-nowdate;
                if((cusCoupon.endTime-nowdate)/(1000 * 60 * 60 * 24)>= 3){
                    return 0
                }else{
                    return 1
                }
            }
        }])
    }
})
