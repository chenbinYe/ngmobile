define(function (require, exports, module) {

    module.exports = function (app) {
        require('directive/shop/ctrl/orderLayout')(app)
        require('directive/shop/ctrl/orderList')(app)
        require('directive/shop/ctrl/orderCoupon')(app)
        require('directive/shop/ctrl/orderCode')(app)
        app.controller(app.cname,['$scope', '$routeParams', 'RQ', '$timeout', '$filter',function ($scope, $routeParams, RQ, $timeout, $filter) {

            F.title('订单')

            wx.hideOptionMenu()
            //离开页面时执行
            $scope.$on("$destroy", function () {
                wx.showOptionMenu()
            })


            F.show_foot_nav($scope)

            /*var app_id = 'wxc4d748bceb3f5aba'
             var pay_host = 'http://piplus.wxpai.cn/open/'
             var open_id = G.user.openId
             var debug = false

             $scope.wx_to_pay_click = 1
             require.async([pay_host + 'jsapi/config.js?appId=' + app_id + '&isDebug=' + debug, 'weixin/pay'], function (a, pay) {
             $scope.wx_to_pay_click = 0
             $scope.wx_to_pay = pay(G.user.openId, G.app_id, G.wx_config_host, $scope)
             })*/

            //$scope.wx_to_pay = require('weixin/pay')($scope)

            $scope.wx_to_pay = function () {
                RQ.post('orders/order_pay_request', {orderID: $scope.order.orderID, appID: G.user.appId, openID: G.user.openId}, function (res) {

                    if (res.errcode == 0) {

                        wx.chooseWXPay({
                            "appId": res.data.appId,
                            "nonceStr": res.data.nonceStr,
                            "package": res.data.package,
                            "signType": "MD5",
                            "paySign": res.data.paySign,
                            "timestamp": res.data.timestamp,
                            success: function (rs) {
                                $scope.order.orderStatus = 2
                                $scope.order.payAmt = $scope.order.receivableAmt
                                $scope.$apply()

                                if (res.data.orderPayID && res.data.orderPayID > 0) {
                                    RQ.put('orders/order_pay_verify', {orderPayID: res.data.orderPayID}, function (res) {
                                        //alert(res.errcode)
                                    })
                                } else {
                                    F.tips('支付异常,请重试......', 1000)
                                }
                            }
                        })
                    }

                    $scope.wx_to_pay_click = 0
                })
            }

            $scope.order_id = $routeParams.id
            //秒杀商品不允许使用优惠
            $scope.sec_Status=$routeParams.secStatus||0

            $scope.show_order = 0
            $scope.show_order_list = 0
            $scope.show_order_layout = 0
            $scope.show_order_coupon = 0
            $scope.show_comfirm = 0

            $scope.ctrl_order = function ($index) {
                set_height_position()
                //
                if ($index >= 0 && $scope.orderAddresses && $scope.orderAddresses[$index].detailAddress != '' && $scope.show_order_list != 0) {
                    $scope.form_order = angular.copy($scope.orderAddresses[$index]);
                    set_address_by_name($index);
                } else {
                    //每次显示地址栏列表的时候，都要重新调去接口返回地址列表
                    if ($scope.show_order_list == 0) {
                        RQ.get("orders/list_cus_address", { cus_code: G.user.id, offset: 0, limit: 10 }, function (res) {
                            if (res && res.errcode == 0) {
                                $scope.orderAddresses = res.cusAddresses || {}

                                //获取用户最新的地址列表后再展示当前地址列表
                                $scope.form_order = {};
                                //$scope.show_order = 1
                                $scope.show_order = 1
                                if ($scope.orderAddresses && $scope.orderAddresses[0] && $scope.show_order_list != 1) {
                                    $timeout(function () {
                                        $scope.show_order_list = 1;
                                    }, 300)
                                    $scope.show_order_layout = 0;
                                } else {
                                    $scope.show_order_list = 0
                                    $timeout(function () {
                                        $scope.show_order_layout = 1
                                    })
                                }
                            }
                        })
                    } else {
                        $scope.show_order_list = 0
                        $timeout(function () {
                            $scope.show_order_layout = 1
                        })
                    }


                }

            }

            $scope.ctrl_order_coupon = function () {
                //每次点击优惠券列表都要重新获取最新实时优惠券列表
                //获取客户优惠券列表
                RQ.get("orders/ordercoupons", {
                    cus_code: G.user.id,
                    shop_id: G.user.ent_code,
                    order_id: $scope.order.orderID
                }, function (res) {
                    if (res && res.errcode == 0) {
                        $scope.cusCoupons = res.cusCoupons || {}
                        if (!$scope.cusCoupons[0] && !$scope.paycoupon) {
                            F.tips('未获得优惠券', 1500)
                            return
                        }
                        set_height_position()
                        $scope.show_order = 1
                        $timeout(function () {
                            $scope.show_order_coupon = 1;
                        }, 300)
                    }
                })

            }

            $scope.ctrl_close_order = function () {
                $scope.show_order_layout = 0
                $scope.show_order_list = 0
                $scope.show_order_coupon = 0
                $scope.show_order_code_slow = 0
                $timeout(function () {
                    $('body')[0].style.height = ''
                    $('body')[0].style.overflow = ''
                    $('body')[0].style.padding = ''

                    $('html')[0].style.height = ''
                    $('html')[0].style.overflow = ''
                    $('html')[0].style.position = ''
                    $("body").scrollTop($scope.bodyOffestHight)
                    $scope.show_order = 0
                    $scope.show_order_code = 0
                }, 300)
            }

            var set_address_by_name = function ($index) {
                for (x in $scope.op.provinces) {
                    if ($scope.op.provinces[x].regionName == $scope.orderAddresses[$index].province) {
                        $scope.form_order.province = $scope.op.provinces[x];
                    }
                }
                $scope.set_cities($scope.form_order.province.regionID)
            }


            //
            $scope.form_order = {}

            var set_height_position = function () {
                //固定页面高度，防止滑动
                $scope.bodyOffestHight = $('body')[0].scrollTop
                $('body')[0].style.height = $(window).height() + 'px'
                $('body')[0].style.overflow = 'hidden'
                $('body')[0].style.padding = '0px'

                $('html')[0].style.position = 'relative'
                $('html')[0].style.overflow = 'hidden'
                $('html')[0].style.height = $(window).height() + 'px'
                $("body").scrollTop(0)
            }
            /*
             // 更换省的时候清空城市
             $scope.$watch('form_order.province', function (province) {
             if (province) {
             RQ.get("regions/list_by_parentid", {parent_id: province.regionID}, function (res) {
             if (res && res.errcode == 0) {
             $scope.form_order.cities = res;
             }
             });
             } else {
             $scope.form_order.city = null;
             }
             });

             // 更换市的时候清空区县
             $scope.$watch('form_order.city', function (city) {
             if (city) {
             RQ.get("regions", {parent_id: city.regionID}, function (res) {
             if (res && res.errcode == 0) {
             $scope.form_order.districts = res;
             }
             });
             } else {
             $scope.form_order.district = null;
             }
             });
             */
            $scope.op = {
                provinces: [],
                cities: [],
                districts: []
            }
            RQ.get("common/regions/list_by_parentid", {parent_id: 1}, function (res) {
                $scope.op.provinces = res.regions
            })

            $scope.set_cities = function (pid) {
                //console.log(pid)
                if (pid) {
                    RQ.get("common/regions/list_by_parentid", {parent_id: pid}, function (res) {
                        $scope.op.cities = res.regions
                        $scope.op.districts = [];
                        if ($scope.form_order.city) {
                            for (x in $scope.op.cities) {
                                if ($scope.op.cities[x].regionName == $scope.form_order.city) {
                                    $scope.form_order.city = $scope.op.cities[x];
                                    $scope.set_districts($scope.form_order.city.regionID)
                                }
                            }
                        }
                    })
                } else {
                    $scope.op.cities = [];
                    $scope.op.districts = [];
                }
            }

            $scope.set_districts = function (pid) {
                RQ.get("common/regions/list_by_parentid", {parent_id: pid}, function (res) {
                    $scope.op.districts = res.regions
                    if ($scope.form_order.district) {
                        for (x in $scope.op.districts) {
                            if ($scope.op.districts[x].regionName == $scope.form_order.district) {
                                $scope.form_order.district = $scope.op.districts[x];
                                $scope.add_cus_address($scope.form_order);
                            }
                        }
                    }
                })
            }

            //获取订单详情
            RQ.get("orders/cusorder/" + $scope.order_id, {}, function (res) {
                if (res && res.errcode == 0) {
                    $scope.order = res.order
//                    console.log(res.order)
                    F.check_shop_id($scope.order.shopID, 'order', $scope.order.orderID)
                    if (res.order.orderAddress) {
                        RQ.get("orders/list_cus_address", { cus_code: G.user.id, offset: 0, limit: 10 }, function (res) {
                            if (res && res.errcode == 0) {
                                $scope.orderAddresses = res.cusAddresses || {}
                            }
                        })
                        $scope.orderAddress = angular.copy(res.order.orderAddress)
                    } else {
                        RQ.get("orders/list_cus_address", { cus_code: G.user.id, offset: 0, limit: 10 }, function (res) {
                            if (res && res.errcode == 0) {
                                //TODO: 暂时显示第一个地址
                                if (res.cusAddresses.length != 0) {
                                    $scope.orderAddresses = res.cusAddresses || {}
                                    //如果用户有过订单，获取之前的所有地址列表并默认选取第一个作为当前订单的地址
                                    $scope.orderAddress = res.cusAddresses[0] || {}
                                    if ($scope.orderAddress && $scope.orderAddress.detailAddress) {
                                        $scope.add_cus_address($scope.orderAddress)
                                    }
                                } else if ($scope.order.orderStatus == 1) {
                                    $scope.ctrl_order()
                                }
                            }
                        })
                    }

                    //订单已使用的优惠券绑定会当前订单
                    if ($scope.order.orderPayments) {
                        for (x in $scope.order.orderPayments) {
                            if ($scope.order.orderPayments[x].accountType == 2) {
                                $scope.paycoupon = $scope.order.orderPayments[x]
                            }
                        }
                    }

                    //获取客户优惠券列表
                    RQ.get("orders/ordercoupons", {
                        cus_code: G.user.id,
                        shop_id: G.user.ent_code,
                        order_id: $scope.order.oderID
                    }, function (res) {
                        if (res && res.errcode == 0) {
                            $scope.cusCoupons = res.cusCoupons || {}
                        }
                    })

                    //订单使用的优惠活动信息
                    if ($scope.order.orderPromotions.length > 0) {
                        angular.forEach($scope.order.orderPromotions, function (v) {
                            if (v.promotionType == 1) {
                                $scope.discount = angular.copy(v)
                            } else if (v.promotionType == 2) {
                                $scope.fullPromotion = angular.copy(v)
                                $scope.order.totalAmt += $scope.fullPromotion.disAmt
                            } else if (v.promotionType == 3) {
                                $scope.Promofreight = angular.copy(v)
                            } else if (v.promotionType == 4) {
                                $scope.orderPromocode = angular.copy(v)
//                                console.log(v)
                                $scope.order.totalAmt += $scope.orderPromocode.disAmt
                            }
                        })
                    }

                }
            })

            //如果待付款,更新时间提示

            //添加收货地址
            $scope.add_cus_address = function (form_order) {


                if (!(/^1[3|4|5|8]\d{9}$/.test(form_order.cellPhone))) {
                    F.tips('请输入有效的手机号码', 1500)
                    $scope.show_address_edit()
                    return;
                }

                if (form_order.postCode && !(/[1-9]\d{5}(?!\d)/.test(form_order.postCode))) {
                    F.tips('请输入正确的邮政编码', 1500)
                    $scope.show_address_edit()
                    return;
                }

                if (!form_order.province || !form_order.city || !form_order.district) {
                    F.tips('请填写收货地址', 1500)
                    $scope.show_address_edit()
                    return
                }

                var _form_order = angular.copy(form_order);
                _form_order.city = form_order.city.regionName || $scope.orderAddress.city
                _form_order.province = form_order.province.regionName || $scope.orderAddress.province
                _form_order.district = form_order.district.regionName || $scope.orderAddress.district
                _form_order.orderID = $scope.order_id

                if (!_form_order.detailAddress) {

                    F.tips('请填写详细地址...', 1500)

                } else {
                    RQ.post('orders/saveaddress', _form_order, function (res) {
                        if (res && res.errcode == 0) {
                            //$scope.orderAddress = angular.copy(form_order)
                            $scope.orderAddress = angular.copy(_form_order);
                            $scope.ctrl_close_order()
                        } else {
                            F.tips("保存失败，请重试...", 1500)
                        }
                    })
                }
            }

            //优惠券使用
            $scope.ctrl_order_coupon_use = function ($index) {
                RQ.post('orders/couponpay', {
                    orderID: $scope.order.orderID,
                    payTypeCode: $index >= 0 ? $scope.cusCoupons[$index].couponCode : '',
                    payTypeName: $index >= 0 ? $scope.cusCoupons[$index].couponName : $scope.paycoupon.payTypeName,
                    appAmt: $index >= 0 ? $scope.cusCoupons[$index].couponAmt : $scope.paycoupon.appAmt,
                    accountCode: $index >= 0 ? $scope.cusCoupons[$index].cusCouponID : $scope.paycoupon.accountCode
                }, function (res) {
                    if (res && res.errcode == 0) {
                        $scope.paycoupon = $index >= 0 ? angular.copy($scope.cusCoupons[$index]) : ''
                        $scope.order.receivableAmt = res.receivableAmt
                        $scope.paycoupon.couponAmt = res.useAmt
                        if ($scope.order.receivableAmt == 0) {
                            $scope.order.orderStatus = 2
                        }
                        $scope.ctrl_close_order()
                    } else {
                        F.tips("优惠券使用失败，请重试", 1500)
                    }
                })
            }

            $scope.show_address_edit = function () {
                $scope.show_order_list = 0
                $scope.show_order_layout = 1
                $timeout(function () {
                    $scope.show_order = 1
                })
            }

            $scope.delay_time = function (now, delay) {
                // now = now.replace(/-/g, '/')
                delay = delay * 60 * 1000
                var time = now + delay
                return $filter('date')(time, 'yyyy-MM-dd HH:mm:ss')
            }

            //确认收货
            $scope.confirm = function ($orderid) {
                F.confirm("确认收货提示","你确定要收货么?")
                $scope.orderid=$orderid
//                RQ.put('orders/receipt/' + $orderid, {}, function (res) {
//                    if (res && res.errcode == 0) {
//                        $scope.order.orderStatus = 4;
//                        F.tips("收货成功，订单完成", 1500)
//                    } else {
//                        F.tips("确认失败，请重试", 1500)
//                    }
//                })
            }
            //接收确认或者取消信息
            $scope.$on('confirmOrder',function(event,data){
                if(data==1){
                RQ.put('orders/receipt/' + $scope.orderid, {}, function (res) {
                    if (res && res.errcode == 0) {
                        $scope.order.orderStatus = 4;
                        F.tips("收货成功，订单完成", 1500)
                    } else {
                        F.tips("确认失败，请重试", 1500)
                    }
                })
                }else{
                    return
                }
            })

            //优惠码
            /*$scope.show_order_code = 1
             set_height_position()
             $timeout(function () {
                $scope.show_order_code_slow = 1
            }, 300)


            $scope.cusPromoCodes = [
                {
                    "cusPromoCodeID": 1,
                    "cusCode": "12",
                    "shopID": 100038,
                    "promoCodeID": 1,
                    "promoCodeName": "优惠码名称",
                    "promoCode": "ABCDE12345",
                    "fullAmt": 100,
                    "promoCodeAmt": 10,
                    "startTime": "2015-05-01 10:00:00",
                    "endTime": "2015-06-01 10:00:00",
                    "orderCode": "",
                    "isStop": 0,
                    "status": 1,
                    "createTime": "2015-05-01 10:00:00"
                },
                {
                    "cusPromoCodeID": 1,
                    "cusCode": "12",
                    "shopID": 100038,
                    "promoCodeID": 1,
                    "promoCodeName": "优惠码名称",
                    "promoCode": "ABCDE12345",
                    "fullAmt": 100,
                    "promoCodeAmt": 10,
                    "startTime": "2015-05-01 10:00:00",
                    "endTime": "2015-06-01 10:00:00",
                    "orderCode": "",
                    "isStop": 0,
                    "status": 1,
                    "createTime": "2015-05-01 10:00:00"
                }
             ]*/


            $scope.ctrl_order_code = function () {
                /*                $scope.show_order_code = 1
                 set_height_position()
                $timeout(function () {
                    $scope.show_order_code_slow = 1
                 }, 300)*/
                //每次点击优惠码列表都要重新获取最新实时优惠券列表
                //获取客户优惠码列表
                RQ.get("promocodes/usablepromocodes?order_id=" + $scope.order.orderID + '&cus_code=' + G.user.id, {}, function (res) {
                    if (res && res.errcode == 0) {
                        $scope.cusPromoCodes = res.cusPromoCodes || []
                        /*if (!$scope.cusPromoCodes[0]) {
                         F.tips('未获得优惠码', 1500)
                         return
                         }*/
                        set_height_position()
                        $scope.show_order_code = 1
                        $timeout(function () {
                            $scope.show_order_code_slow = 1;
                        }, 300)
                    }
                })
            }


            //兑换优惠码
            $scope.input = {promo_code: ''}
            $scope.ctrl_order_code_verify = function (promo_code) {
                if (!promo_code || promo_code == '') {
                    F.tips('请输入优惠码', 1500)
                } else {
                    promo_code = promo_code.toLocaleUpperCase()
                    RQ.post('promocodes/exchange', {
                        "shopID": G.user.ent_code,
                        "orderID": $scope.order.orderID,
                        "cusCode": G.user.id,
                        "cusName": G.user.name,
                        "promoCode": promo_code,
                        "source": "订单页面直接使用"
                    }, function (res) {
                        if (res && res.errcode == 0) {
                            var cusPromoCode = {
                                promo_code: promo_code,
                                promoCodeName: res.promoCodeName,
                                cusPromoCodeID: res.id,
                                promoCodeAmt: res.promoCodeAmt
                            }
                            $scope.ctrl_order_code_use(cusPromoCode)
                        } else {
                            $scope.input.promo_code = promo_code
                            F.tips('您输入的优惠码有误或优惠码无法在该订单使用', 1500)
                        }
                    })
                    /*                    RQ.get('promocodes/cuspromocode/' + promo_code, {}, function (res) {
                     if (res && res.errcode == 0) {
                     $scope.ctrl_order_code_use(promo_code)
                     } else {
                     $scope.promocode = promo_code
                     F.tips('输入的优惠码有误，请重新输入', 1500)
                     }
                     })*/
                }
            }

            //订单使用优惠码
            $scope.ctrl_order_code_use = function (cusPromoCode) {
                RQ.put('orders/use_promocode', {
                    "orderID": $scope.order.orderID,
                    "cusPromoCodeID": cusPromoCode.cusPromoCodeID
                }, function (res) {
                    if (res && res.errcode == 0) {
//                        $scope.input.promo_code = cusPromoCode.promo_code
                        $scope.orderPromocode = {
                            promotionName: cusPromoCode.promoCodeName,
                            promotionID: cusPromoCode.cusPromoCodeID,
                            disAmt: res.useAmt
                        }
                        /*                        console.log(cusPromoCode)
                         console.log(res)*/
                        $scope.order.receivableAmt = res.receivableAmt
                        if ($scope.order.receivableAmt == 0) {
                            $scope.order.orderStatus = 2
                        }
                        $scope.ctrl_close_order()
                    } else {
                        F.tips('服务器异常，请再试一次', 1500)
                    }
                })
            }

            $scope.check_promocode = function (input) {
                $scope.input.promo_code = input.promo_code.toLocaleUpperCase()
            }

            //取消已使用的优惠码
            $scope.ctrl_order_code_cancel = function () {
//                console.log('chungeshabi')
                var cusPromoCode = {
                    promo_code: 0,
                    promoCodeName: 0,
                    cusPromoCodeID: 0
                }
                $scope.ctrl_order_code_use(cusPromoCode)
            }


        }])

    }
})