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

            RQ.get('carts', {cus_code: G.user.id, shop_id: G.user.ent_code}, function (res) {
                if (res && res.errcode == 0) {
                    $scope.goods = res.cart.cartSubs
                    angular.forEach(res.cart.cartPromotions, function (v, k) {
                        if (v.promotionType == 1) {
                            $scope.discount = angular.copy(v)
                        } else if (v.promotionType == 2) {
                            $scope.fullPromotion = angular.copy(v)
                        } else if (v.promotionType == 3) {
                            $scope.freight = angular.copy(v)
                        }
                    })
                    _total_price()
                }
            })

            $scope.save_cart = function () {
                var tempArr = []
                angular.forEach($scope.goods, function (v, k) {
                    tempArr[k] = {
                        productID: v.productID,
                        skuID: v.skuID,
                        qty: v.qty,
                        isSelect: v.isSelect,
                        isDelete: v.isDelete || 0
                    }
                })
                RQ.put('carts/update', {
                    shopID: G.user.ent_code,
                    cusCode: G.user.id,
                    cartSubs: tempArr
                }, function (res) {
                    if (res.errcode == 0) {
                        $scope.goods = res.cart.cartSubs
                        var discount = {}, fullPromotion = {}, freight = {}
                        angular.forEach(res.cart.cartPromotions, function (v, k) {
                            if (v.promotionType == 1) {
                                discount = v
                            } else if (v.promotionType == 2) {
                                fullPromotion = v
                            } else if (v.promotionType == 3) {
                                freight = v
                            }
                        })
                        $scope.discount = angular.copy(discount)
                        $scope.fullPromotion = angular.copy(fullPromotion)
                        $scope.freight = angular.copy(freight)
                        _total_price()
                        $timeout(function () {
                            F.tips('成功修改购物车商品', 1500)
                        }, 10)
                    }
                })
            }

            //检查输入商品数量是否为数字
            $scope.check_quantity = function (good) {
                /*if (good.qty > good.stockQty) {
                 F.tips('所填数字超出商品库存总量...', 1500)
                 }*/
                good.qty = F.changeTwoDecimal(good.qty)
                if (good.qty > good.stockQty) {
                    good.qty = angular.copy(good.stockQty)
                } else if (good.qty <= 0) {
                    good.qty = 1
                }
//                good.qty = good.qty.replace(/\D/g, '');
            }


            //删除商品
            $scope.to_del = function () {
                angular.forEach($scope.goods, function (v, k) {
                    if (v.isSelect == 1) {
                        $scope.goods[k].isDelete = 1
                    }
                })
                $scope.save_cart()
            }

            //修改商品数量
            $scope.set_order = function ($index, plus) {
                if (plus) {
                    $scope.goods[$index].qty++
                } else if ($scope.goods[$index].qty > 1 && !plus) {
                    $scope.goods[$index].qty--
                }
                if ($scope.goods[$index].qty > $scope.goods[$index].stockQty) {
//                    console.log($scope.goods[$index].stockQty,$scope.goods[$index].qty)
                    $scope.goods[$index].qty = $scope.goods[$index].stockQty
                    F.tips('已达到商品最大库存...', 1500)
                }
            }

            //购物车状态切换，编辑或者结算
            $scope.change_op = function (o) {
                if ($scope.op == 1) {
                    var outStockQty = false
                    angular.forEach($scope.goods, function (v, k) {
                        if (v.qty > v.stockQty) {
//                            $scope.goods[k].qty = v.stockQty
                            outStockQty = true
                        }
                    })
                    if (outStockQty) {
                        F.tips('所填数量超出商品库存总量...', 1500)
                        return 0
                    }
                    $scope.save_cart()
                }
                $scope.op = o
            }

            //勾选商品
            $scope.to_checked = function ($index, operate) {
                if ($scope.goods[$index].isSelect == 1) {
                    $scope.goods[$index].isSelect = 0
                } else {
                    $scope.goods[$index].isSelect = 1
                }
                if (operate == 'del') {
                    _total_price()
                } else {
                    $scope.save_cart()
                }
            }

            //全选
            $scope.to_all_check = function () {
                if (F.json_length($scope.goods) == $scope.select_count) {
                    angular.forEach($scope.goods, function (v, k) {
                        $scope.goods[k].isSelect = 0
                    })
                } else {
                    angular.forEach($scope.goods, function (v, k) {
                        $scope.goods[k].isSelect = 1
                    })
                }
                $scope.save_cart()
            }


            $scope.total_price = 0
            $scope.select_count = 0
            var _total_price = function () {
                var total = 0, select_counter = 0
                angular.forEach($scope.goods, function (v, k) {
                    if (v.isSelect == 1) {
                        select_counter++
                        total += F.changeTwoDecimal(v.realPrice) * v.qty
                    }
                })
                $scope.select_count = select_counter
                $scope.total_price = F.changeTwoDecimal(total)
                $scope.after_dis_total = F.changeTwoDecimal(total)
                if ($scope.fullPromotion && $scope.fullPromotion.isUse) {
                    $scope.after_dis_total = total - $scope.fullPromotion.disAmt
                }
                $scope.after_dis_total = F.changeTwoDecimal($scope.after_dis_total)
            }

            //点击结算按钮
            $scope.to_order = function () {
                var stop = false
                angular.forEach($scope.goods, function (v, k) {
                    if (v.isSelect == 1 && v.isStockOut == 1) {
                        stop = true
                    }
                })
                if (stop) {
                    F.tips('购物车包含库存不足商品....', 1500)
                    return 0
                }
                var promotionAmt = 0, freight = 0
                if ($scope.fullPromotion && $scope.fullPromotion.isUse) {
                    promotionAmt += $scope.fullPromotion.disAmt
                }
                if ($scope.discount && $scope.discount.isUse) {
                    promotionAmt += $scope.discount.disAmt
                }
                if ($scope.freight && !$scope.freight.isUse) {
                    freight = $scope.freight.freight
                }
                RQ.post("orders/save_order", {
                    shopID: G.user.ent_code,
                    openID: G.user.openId,
                    cusCode: G.user.id,
                    cusName: G.user.name,
                    totalAmt: $scope.after_dis_total,
                    promotionAmt: promotionAmt,
                    freight: freight
                }, function (res) {
                    if (res && res.errcode == 0) {
                        $location.url('/shop/index/order?id=' + res.order.orderID);
                    } else {
                        F.tips('结算失败', 1500)
                    }
                })
            }
        }])
    }
})