define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {

            F.title('购物车')
            F.foot_fix($scope);

            F.show_foot_nav($scope)

            $scope._list = {
                check: {},
                del: {}
            }
            $scope.op = 0

            RQ.get('common/caches/get/cart_' + G.user.id + '_' + G.user.ent_code, {}, function (res) {
                if (res.errcode == 0) {

                    res.data = res.data || '{}'
                    $scope.goods = {}
                    var _goods_list = JSON.parse(res.data)
                    var cartSubs = []
                    angular.forEach(_goods_list, function (v, k) {
                        if (v.ent_code == G.user.ent_code) {
                            $scope.goods[k] = v
                            /*cartSubs.push({
                             productID: v.productID,
                             skuID: v.skuID,
                             unitPrice: v.price,
                             qty: v.num,
                             subTotalAmt: v.price*v.num
                             })*/
                        }
                    })

                    /*RQ.put('promotions/calculate', {
                     shopID: G.user.ent_code,
                     cusCode: G.user.id,
                     totalAmt: '',
                     cartSubs: cartSubs
                     }, function (res) {
                     if(res&&res.errcode==0){

                     }
                     })*/

                    //获取商店运费活动详情
                    RQ.get('freights/default_freight', {
                        shop_id: G.user.ent_code
                    }, function (res) {
                        if (res.errcode == 0) {
                            $scope.freight = res.freight || {}
                        }
                    })

                    //打折活动信息验证,无效则清除之
                    //暂时无法完成该功能
                    /*if ($scope.goods.discount && $scope.goods.discount.discountID > 0) {
                     RQ.get('discounts/' + $scope.product.discount.discountID, {}, function (res) {
                     if (res && res.errcode == 0 && !res.discount) {
                     $scope.goods.discount = ''
                     }
                     })
                     }*/


                    $scope.to_all_check()
                }
            })

            $scope.change_op = function (o) {
                $scope.op = o
                _total_price()
                if ($scope.op == 0) {
                    var _cart = angular.copy($scope.goods)
                    RQ.post('common/caches/set/cart_' + G.user.id + '_' + G.user.ent_code, _cart, function (res) {
                        if (res.errcode == 0) {
                            $timeout(function () {
                                F.tips('成功修改购物车商品', 1500)
                            }, 10)

                        }
                    })
                }
            }


            $scope.to_checked = function (good, op) {
                op = op || 'check'
                var _unique_id = good.skuID || good.id
                if ($scope._list[op][_unique_id]) {
                    delete $scope._list[op][_unique_id]
                } else {
                    $scope._list[op][_unique_id] = good
                }
                _total_price()
            }

            $scope.to_all_check = function (op) {
                op = op || 'check'
                if (F.json_length($scope._list[op]) == F.json_length($scope.goods)) {
                    $scope._list[op] = {}
                } else {
                    angular.forEach($scope.goods, function (v, k) {
                        var _unique_id = v.skuID || v.id
                        $scope._list[op][_unique_id] = v
                    })
                }
                _total_price()
            }


            $scope.total_price = 0
            var _total_price = function () {

                var total = 0, tempArray = [];
                angular.forEach($scope._list['check'], function (v, k) {

                    var lastest_price = v.price

                    total += parseFloat(lastest_price) * v.num
                })
                if ($scope.op == 0) {
                    angular.forEach($scope.goods, function (v, k) {
//                        console.log(v.num);
                        if (v.num == 0) {
                            v.num = 0;
                            tempArray.push(k);
                        }
//                        console.log(v.num);
                    })
                    if (tempArray.length > 0) _delete_list_zero(tempArray);
                }
                $scope.total_price = F.changeTwoDecimal(total)
            }
            var _delete_list_zero = function (array) {
                if (angular.isArray(array)) {
                    angular.forEach(array, function (value) {
//                        delete $scope.goods[value];
                        delete $scope._list['check'][value];
                    })
                }
            }
            $scope.to_order = function () {
                // console.log("goods:", $scope.goods)
                //console.log("_list:", $scope._list)

                //提交订单的时候验证运费活动是否还有效
                /*RQ.get('freights/default_freight', {
                 shop_id: G.user.ent_code
                 }, function (res) {
                 if (res.errcode == 0) {
                 $scope.freight = res.freight || {}
                 }
                 })*/


                var orderPromotions = []
                var orderPromotions_detail = {}

                var orderSubs = [];
                angular.forEach($scope._list.check, function (v, k) {

                    var lastest_price = v.price
                    var unitPrice = v.price

                    //限时打折
                    if (v.discount && v.discount.promotionID > 0) {
                        lastest_price = v.price
                        unitPrice = F.changeTwoDecimal((lastest_price / v.discount.discount ) * 100)
                        if (orderPromotions_detail && orderPromotions_detail.promotionType > 0) {
                            orderPromotions_detail.disAmt += F.changeTwoDecimal((lastest_price / v.discount.discount ) * 100 - lastest_price) * v.num
                        } else {
                            orderPromotions_detail = {
                                "promotionType": 1,
                                "promotionID": v.discount.promotionID,
                                "benefitType": 1,
                                "disAmt": F.changeTwoDecimal((lastest_price / v.discount.discount ) * 100 - lastest_price) * v.num
                            }
                        }
                    }

                    //满减满送
                    if (v.fullPromotion && v.fullPromotion.promotionID > 0) {

                    }


                    orderSubs.push({
                        skuID: v.skuID,
                        productID: v.id,
                        productName: v.name,
                        productSpecContent: v.productSpecContent,
                        originalPrice: v.originalPrice,
                        unitPrice: unitPrice,
                        disAmt: F.changeTwoDecimal(unitPrice - lastest_price) * v.num,
                        qty: v.num,
                        subTotalAmt: lastest_price * v.num
                    })
                })

                if (orderPromotions_detail && orderPromotions_detail.promotionType > 0) {
                    orderPromotions.push(orderPromotions_detail)
                }

                var orderAmt = 0;   //订单总金额
                angular.forEach(orderSubs, function (v, k) {
                    orderAmt += v.subTotalAmt;
                })
                RQ.post("orders/saveorder", {
                    shopID: G.user.ent_code,
                    openID: G.user.openId,
                    cusCode: G.user.id,
                    cusName: G.user.name,
                    orderAmt: orderAmt,
                    freight: ($scope.freight && orderAmt < $scope.freight.fullAmt) ? $scope.freight.freight : 0,
                    orderSubs: orderSubs,
                    orderPromotions: orderPromotions
                }, function (res) {
                    if (res && res.errcode == 0) {
                        // $scope.to_del();

                        angular.forEach($scope._list['check'], function (v, k) {
                            //console.log(v)
                            delete $scope.goods[k]
                        })
                        var _cart = angular.copy($scope.goods);
                        RQ.post('common/caches/set/cart_' + G.user.id + '_' + G.user.ent_code, _cart, function (res) {
                            // if(res.errcode==0){
                            //     $timeout(function(){
                            //         F.tips('成功删除购物车商品',1500)
                            //     },10)

                            // }
                        })
                        $location.url('/shop/index/order?id=' + res.order.orderID);
                    } else {
                        F.tips('结算失败', 1500)
                    }
                })

                //$location.url('/shop/index/order')

                /*var _cart = angular.copy($scope.goods)
                 RQ.post('common/caches/set/cart_'+G.user.id,_cart,function(res){
                 if(res.errcode==0){
                 $timeout(function(){
                 F.load('成功删除购物车商品',1500)
                 },10)

                 }
                 })*/

            }

            $scope.to_del = function () {
                angular.forEach($scope._list['del'], function (v, k) {
                    //console.log(v)
                    // if($scope._list['del'].hasOwnProperty(v.skuID)){
                    //$scope.goods.splice($scope.goods.indexOf(v), 1);

                    var _unique_id = v.skuID || v.id

                    delete $scope.goods[_unique_id]
                    delete $scope._list['del'][_unique_id]
                    delete $scope._list['check'][_unique_id]
                    //}
                })
                _total_price()

                var _cart = angular.copy($scope.goods)
                RQ.post('common/caches/set/cart_' + G.user.id + '_' + G.user.ent_code, _cart, function (res) {
                    if (res.errcode == 0) {
                        $timeout(function () {
                            F.tips('成功删除购物车商品', 1500)
                        }, 10)

                    }
                })
            }

            $scope.set_order = function (good, plus) {

                if (plus && good.stockQty && good.num < good.stockQty) {
                    good.num++
                } else if (good.num > 0 && !plus) {
                    good.num--
                }
            }

            $scope.check_quantity = function (good) {
                good.num = good.num.replace(/\D/g, '');
                if (good.num > good.stockQty) {
                    good.num = angular.copy(good.stockQty)
                } else if (good.num < 0) {
                    good.num = 0
                }
            }


        }])
    }
})