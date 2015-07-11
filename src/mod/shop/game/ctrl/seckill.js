define(function (require, exports, module) {
    module.exports = function (app) {
        require('directive/shop/ctrl/seckillRes')(app)

        // var seckill=require('mod/shop/game/app/seckill_'+ G.user.ent_code)
        var wx_share = require('weixin/share')
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', '$rootScope', function ($scope, $routeParams, RQ, $timeout, $location, $rootScope) {

            require.async('mod/shop/game/ctrl/seckill_' + G.user.ent_code, function (seckill) {
                $scope.secAction = seckill($scope, wx_share)
                //初始化
                $scope.secAction.init()
                $scope.clock = {
                    hour_a: 0,
                    hour_b: 0,
                    minute_a: 0,
                    minute_b: 0,
                    second_a: 0,
                    second_b: 0
                }
                //控制秒杀按钮功能
                $scope.show_sec = 0
                var res_int = 0
                var saletime = 0
                var nowtime = 0
                var seck_id = ""
                //获取离开始时间最近的一个有效秒杀活动信息
                RQ.get('seckilling?shop_id=' + G.user.ent_code, {}, function (res) {
                    if (res && res.errcode == 0 && res.data) {
                        saletime = res.data.startTime
                        nowtime = res.data.curTime
                        seck_id = res.data.seckID
                        $scope.settime()
                        $scope.productId = res.data.productID
                        $scope.skuID = res.data.skuID
                    } else {
                        F.tips("暂时还没有秒杀活动", 1500)
                    }
                })
                $scope.settime = function () {
                    res_int = setInterval(settim, 1000)
                }
                //离开页面时不再执行倒计时
                $scope.$on("$destroy", function () {
                    clearTimeout(res_int)
                })
                var settim = function () {
//                var saletime = new Date("2015/05/29 00:00:00").getTime();
//                var nowtime = new Date().getTime()
                    var leftsecond = (saletime - nowtime) / 1000  //计算天数后剩余的毫秒数
                    if (leftsecond <= 0) {
                        clearTimeout(res_int)
                        $scope.show_sec = 1
                        $scope.$apply()
                    } else {
                        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
                        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
                        $scope.clock.hour_a = Math.floor(hour / 10)
                        $scope.clock.hour_b = hour % 10
                        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
                        $scope.clock.minute_a = Math.floor(minute / 10)
                        $scope.clock.minute_b = minute % 10
                        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
                        $scope.clock.second_a = Math.floor(second / 10)
                        $scope.clock.second_b = second % 10
                        $scope.$apply()
                        nowtime = nowtime + 1000
                    }
                }
                //申请秒杀
                $scope.checkres = function () {
                    if ($scope.show_sec == 0) return
                    //申请秒杀商品
                    F.tips("正在秒杀!", 1000000)
                    RQ.get('seckilling/apply?cus_code=' + G.user.id + '&seck_id=' + seck_id, {}, function (re) {
                        if (re && re.errcode == 0 && re.applyCode) {
                            //申请成功的话，调用秒杀结果接口
                            var getresult = function () {
                                RQ.get('seckilling/result?cus_code=' + G.user.id + '&apply_code=' + re.applyCode, {}, function (res) {
                                    if (res && res.result == 1) {
                                        F.tips(false, 0)
                                        $scope.to_order() //秒杀成功的话调用订单接口并跳转到订单页面
                                    }
                                    if (res && res.result == 0) {//秒杀失败
                                        F.tips(false, 0)
                                        $scope.secAction.saleOut()
                                    }
                                    if (res && res.result == -1) {//秒杀结果未知
                                        $timeout(getresult, 1000)
                                    }
                                })
                            }
                            $timeout(getresult, 2000)
                        } else {
                            F.tips("正在秒杀!", 3000)
                            $timeout($scope.secAction.saleOut, 3000)
                        }
                    })
                }
                //添加到订单
                $scope.to_order = function () {
                    var orderSubs = []
                    var specItemGroup = ""
                    //查看商品信息
                    RQ.get("products/" + $scope.productId, {}, function (res) {
                        if (res && res.errcode == 0) {
                            if (res.productSpecs.length > 0 && $scope.skuID > 0) {  //如果商品有规格
                                angular.forEach(res.productSkus, function (v, k) {
                                    if (v.skuID == skuID) {
                                        specItemGroup = v.specItemGroup
                                    }
                                })
                                orderSubs = [
                                    {
                                        skuID: $scope.skuID,
                                        productID: $scope.productId,
                                        productName: res.productName,
                                        productSpecContent: res.productSpecs[0].specName + ":" + specItemGroup,
                                        originalPrice: res.originalPrice,
                                        unitPrice: 6.1,
                                        disAmt: 0,
                                        qty: 1,
                                        subTotalAmt: 6.1
                                    }
                                ]
                            } else {
                                orderSubs = [
                                    {
                                        skuID: 0,
                                        productID: $scope.productId,
                                        productName: res.productName,
                                        productSpecContent: "",
                                        originalPrice: res.originalPrice,
                                        unitPrice: 6.1,
                                        disAmt: 0,
                                        qty: 1,
                                        subTotalAmt: 6.1
                                    }
                                ]
                            }
                            var order = {
                                shopID: G.user.ent_code,
                                openID: G.user.openId,
                                cusCode: G.user.id,
                                cusName: G.user.name,
                                orderAmt: 6.1,
                                freight: 0,
                                orderSubs: orderSubs
                            }
                            RQ.post("orders/saveorder", order, function (res) {

                                if (res && res.errcode == 0) {
                                    F.tips(true, 1500)
                                    $location.url('/shop/index/order?id=' + res.order.orderID);
                                } else {
                                    $scope.secAction.saleOut()
                                }
                            })
                        } else {
                            $scope.secAction.saleOut()
                        }
                    })
                }
            })
        }])
    }
})