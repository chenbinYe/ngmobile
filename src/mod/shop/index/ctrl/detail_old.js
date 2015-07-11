define(function (require, exports, module) {

    module.exports = function (app) {
        require('directive/shop/ctrl/pjCarousel')(app)
        require('directive/shop/ctrl/bottomFix')(app)
        require('directive/shop/ctrl/productStatus')(app)
        require('directive/shop/ctrl/specialProduct')(app)
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', '$sce', function ($scope, $routeParams, RQ, $timeout, $location, $sce) {
            //$scope.vm = $routeParams

            //防止错误id引起的误操作
            if (!$routeParams.id) {
                $location.path('/')
                return
            }

            $scope.id = $routeParams.id

            F.foot_fix($scope);
            F.show_foot_nav($scope)
            $scope.special = 0

            //秒杀商品在商品详情不能点击购买
            $scope.productIds = [187, 197, 199, 188, 191, 193, 194, 186, 189, 190, 192, 195, 196, 198]
            angular.forEach($scope.productIds, function (v, k) {
                if (v == $routeParams.id) {
                    $scope.special = 1
                }
            })


            $scope.sku_key = []
            $scope.sku_value = {}

            $scope.order = {
                num: 1,
                id: $scope.id
            }

            $scope.set_order = function (plus) {

                if (plus && $scope.sku_value.num && $scope.order.num < $scope.sku_value.num) {
                    $scope.order.num++
                } else if ($scope.order.num > 0 && !plus) {
                    $scope.order.num--
                }
            }

            $scope.check_quantity = function (good) {
                if (good.num > $scope.sku_value.num) {
                    good.num = angular.copy($scope.sku_value.num)
                } else if (good.num < 0) {
                    good.num = 0
                }
            }

            $scope.sku_item_active = function (item, $index) {
                return ($scope.sku_key[$index] && $scope.sku_key[$index] == item) && 'tag-orangef60 active' || '';
            }

            $scope.details = "";
            // RQ.get('product',{ product_id: $routeParams.id },function(d){
            RQ.get('products/' + $routeParams.id, {}, function (d) {
                if (d && d.errcode == 0 && d.productID > 0) {
                    F.check_shop_id(d.shopID, 'detail', $routeParams.id)
                    $scope.product = d;
                    F.title($scope.product.productName)
                    //先将html片段标记为信任,在标签用属性ng-bind-html='details'取消转义
                    if ($scope.product.productDetail && $scope.product.productDetail.details) {
                        //$scope.details = $sce.trustAsHtml($scope.product.productDetail.details);

                        //str.replace('http://fs.wxpai.cn','http://img2.wxpai.cn')
                        //@60w_60h_1x.jpg
                        var windows_width = 800
                        if (G.windows_width <= 320) {
                            windows_width = '@320w_1x.jpg"'
                        }
                        else if (G.windows_width <= 480) {
                            windows_width = '@480w_1x.jpg"'
                        }
                        else if (G.windows_width <= 640) {
                            windows_width = '@640w_1x.jpg"'
                        } else {
                            windows_width = '@800w_1x.jpg"'
                        }
                        var str = $scope.product.productDetail.details;
                        str = str.replace(/src="http:\/\/fs.wxpai.cn\/([^"]+)"/gi, 'src="http://img2.wxpai.cn/$1' + windows_width + '"');

                        $scope.details = $sce.trustAsHtml(str);
                    }
                    $scope.sku = {
                        opt: [],
                        value: {}
                    }

                    //console.log($scope.product)

                    if ($scope.product.productSpecs.length > 0) {  //如果商品有规格

                        //组装sku.opt数组
                        angular.forEach($scope.product.productSpecs, function (v, k) {
                            var optObj = {name: "", values: []}; //sku.opt数组里的每个对象
                            optObj.name = v.specName;
                            angular.forEach(v.productSpecItems, function (val, key) {
                                optObj.values[key] = val.specItemValue;
                            })
                            $scope.sku.opt.push(optObj);
                        });

                        //组装sku.value对象
                        angular.forEach($scope.product.productSkus, function (v, k) {
                            var saleprice = v.salePrice

                            //限时打折
                            if ($scope.product.discount && $scope.product.discount.promotionID) {
                                saleprice = v.salePrice * $scope.product.discount.discount / 100
                            }

                            $scope.sku.value[v.specItemGroup] = {
                                num: v.stockQty,
                                price: v.salePrice,
                                skuID: v.skuID,
                                latest_price: saleprice
                            }
                        })

                        $scope.sku_key = new Array($scope.sku.opt.length)

                        angular.forEach($scope.sku.opt, function (v, k) {
                            $scope.sku_key[k] = v.values[0]
                        })

                        var _key = $scope.sku_key.join('#')
                        $scope.sku_value = $scope.sku.value[_key]
                        $scope.order.skuID = $scope.sku.value[_key].skuID;
                        $scope.order.key = _key
                    } else {
                        $scope.sku_value.num = angular.copy($scope.product.totalStockQty)
                        $scope.sku_value.price = angular.copy($scope.product.salePrice)
                        $scope.sku_value.latest_price = angular.copy($scope.product.salePrice)
                    }

                    $scope.lastest_price = $scope.product.salePrice

                    $scope.order.num = ($scope.sku_value.num > 0) ? $scope.order.num : 0

                    //如果返回商品信息包含运费活动，则显示运费活动
                    if ($scope.product.freight && $scope.product.freight.freightID) {
                        RQ.get('freights/' + $scope.product.freight.freightID, {}, function (res) {
                            if (res && res.errcode == 0 && res.freight.freightID > 0) {
                                $scope.freight = res.freight || {}
                            }
                        })
                    }


                    //如果返回的商品信息包含限时打折消息，则显示限时打折消息
                    if ($scope.product.discount && $scope.product.discount.promotionID > 0) {
                        $scope.discount = $scope.product.discount
                        $scope.lastest_price = $scope.product.discount.discount * $scope.lastest_price / 100
                        $scope.sku_value.latest_price = $scope.lastest_price
                    }

                    //如果返回的商品信息包含满减满送消息，则显示满减满送消息
                    if ($scope.product.fullPromotion && $scope.product.fullPromotion.promotionID > 0) {
                        $scope.fullPromotion = $scope.product.fullPromotion
                    }

                } else {

                    F.tips('该商品不存在', 2000)
                    //$location.path('/')
                }
            })

            //点击立即购买
            $scope.to_order = function (o) {
                F.tips('订单提交中，请稍后...', 0, true)

                // $timeout(function(){
                //     $F.load(false)
                //     $location.path('/shop/index/order')
                // },1000)
                //提交订单  POST
                var orderSubs = []

                //验证运费活动是否还有效
                /*if ($scope.product.freight && $scope.product.freight.freightID > 0) {
                 RQ.get('freights/' + $scope.product.freight.freightID, {}, function (res) {
                 if (res && res.errcode == 0) {
                 $scope.freight = res.freight || {}
                 }
                 })
                 }*/

                //验证限时打折活动是否还有效，若有效在提交订单里面计算出数据并提交
                var orderPromotions = []
                /*if ($scope.discount && $scope.discount.discountID > 0) {
                 RQ.get('discounts/' + $scope.product.discount.discountID, {}, function (res) {
                 if (res && res.errcode == 0 && res.discount.discountID > 0) {
                 $scope.discount = res.discount || {}
                 }
                 })
                 }*/


                //运费活动
                if ($scope.product.freight && $scope.product.freight.freightID > 0) {
                    $scope.freight.freight = ($scope.freight && $scope.sku_value.price * $scope.order.num < $scope.freight.fullAmt) ? $scope.freight.freight : 0
                } else {
                    $scope.freight = {}
                    $scope.freight.freight = 0
                }

                //限时打折信息记录
                if ($scope.product.discount && $scope.product.discount.promotionID > 0) {
                    orderPromotions.push({
                        "promotionType": $scope.product.discount.promotionType,
                        "promotionID": $scope.product.discount.promotionID,
                        "benefitType": $scope.product.discount.benefitType,
                        "disAmt": F.changeTwoDecimal($scope.sku_value.price - $scope.sku_value.latest_price) * $scope.order.num
                    })
                }

                //满减活动信息记录
                if ($scope.product.fullPromotion && $scope.product.fullPromotion.promotionID > 0) {
                    var total_price = $scope.sku_value.latest_price * $scope.order.num
                    var fullAmt = 0
                    var disAmt = 0
                    var benifitType = 0
                    angular.forEach($scope.fullPromotion.fullPromotionSubs, function (v, k) {
                        if (v.fullAmt >= fullAmt && total_price >= v.fullAmt) {
                            fullAmt = v.fullAmt
                            disAmt = v.disAmt
                            benifitType = v.benefitType
                        }
                    })
                    if (fullAmt > 0) {
                        orderPromotions.push({
                            "promotionType": $scope.product.fullPromotion.promotionType,
                            "promotionID": $scope.product.fullPromotion.fullPromotionID,
                            "benefitType": benifitType,
                            "disAmt": disAmt
                        })
                    }
                }


                if ($scope.product.productSpecs.length > 0) {  //如果商品有规格
                    orderSubs = [
                        {
                            skuID: $scope.order.skuID,
                            productID: $scope.id,
                            productName: $scope.product.productName,
                            productSpecContent: (function () {
                                var arr = [];
                                angular.forEach($scope.sku.opt, function (v, k) {
                                    arr.push(v.name + ":" + $scope.sku_key[k]);
                                })
                                return arr.join(" ");
                            })(),
                            originalPrice: $scope.product.originalPrice,
                            unitPrice: $scope.sku_value.price,
                            disAmt: F.changeTwoDecimal($scope.sku_value.price - $scope.sku_value.latest_price) * $scope.order.num,
                            qty: $scope.order.num,
                            subTotalAmt: $scope.sku_value.price * $scope.order.num
                        }
                    ]

                } else {
                    orderSubs = [
                        {
                            skuID: 0,
                            productID: $scope.id,
                            productName: $scope.product.productName,
                            productSpecContent: "",
                            originalPrice: $scope.product.originalPrice,
                            unitPrice: $scope.sku_value.price,
                            disAmt: ($scope.sku_value.price - $scope.sku_value.latest_price) * $scope.order.num,
                            qty: $scope.order.num,
                            subTotalAmt: $scope.sku_value.latest_price * $scope.order.num
                        }
                    ]
                }
                var order = {
                    shopID: G.user.ent_code,
                    openID: G.user.openId,
                    cusCode: G.user.id,
                    cusName: G.user.name,
                    orderAmt: $scope.sku_value.latest_price * $scope.order.num,
                    freight: $scope.freight.freight,
                    orderSubs: orderSubs,
                    orderPromotions: orderPromotions
                }
                // console.log(order)
                // RQ.get("createOrder", order, function(res){
                RQ.post("orders/saveorder", order, function (res) {
                    //console.log(res)
                    if (res && res.errcode == 0) {
                        F.tips(true, 1500)
                        $location.url('/shop/index/order?id=' + res.order.orderID);
                    } else {
                        alert('添加失败，请重试')
                    }
                })
            }


            $scope.add_to_order = function (order) {


                var unique_id = order.skuID || order.id
                if (!$scope.cart[unique_id]) {

                    var _order = {}
                    _order.name = $scope.product.productName
                    _order.img = $scope.product.productImages[0].url
                    _order.skuID = order.skuID || 0
                    _order.sku = order.key && order.key.split('#') || []
                    _order.price = $scope.sku_value.price
                    _order.productID = $scope.product.productID

                    //限时打折
                    _order.discount = $scope.product.discount ? $scope.product.discount : ''
                    //满减满送
                    _order.fullPromotion = $scope.product.fullPromotion ? $scope.product.fullPromotion : ''

                    //后来添加
                    _order.originalPrice = $scope.product.originalPrice,
                        _order.productSpecContent = (function () {
                            if ($scope.product.productSpecs.length > 0) {  //如果商品有规格
                                var arr = [];
                                angular.forEach($scope.sku.opt, function (v, k) {
                                    arr.push(v.name + ":" + $scope.sku_key[k]);
                                })
                                return arr.join(" ");
                            } else {
                                return ""
                            }
                        })(),

                        _order.num = order.num
                    _order.id = order.id
                    _order.stockQty = $scope.sku_value.num
                    //
                    $scope.cart[unique_id] = $scope.cart[unique_id] || {}
                    $scope.cart[unique_id].num = $scope.cart[unique_id].num && parseInt($scope.cart[unique_id].num) || 0
                    //
                    var total_num = parseInt($scope.cart[unique_id].num) + parseInt(order.num)
                    if ($scope.sku_value.num >= total_num) {
                        $scope.cart[unique_id].num = total_num
                    } else {
                        F.tips('购物车该商品数量大于总库存', 1500)
                        return
                    }

                    $scope.cart[unique_id] = _order

                } else {

                    var total_num = parseInt($scope.cart[unique_id].num) + parseInt(order.num)
                    if ($scope.sku_value.num >= total_num) {
                        $scope.cart[unique_id].num = total_num
                    } else {
                        F.tips('购物车该商品数量大于总库存', 1500)
                        return
                    }
                }

                //增加entcode 避免商城之间商品混乱
                $scope.cart[unique_id].ent_code = G.user.ent_code
                //
                var _cart = angular.copy($scope.cart)
                RQ.post('common/caches/set/cart_' + G.user.id + '_' + G.user.ent_code, _cart, function (res) {
                    if (res.errcode == 0) {
                        $timeout(function () {
                            F.tips('成功添加到购物车', 1500)
                            F.detal.ctrl_sku_close()
                        }, 10)

                    }

                })
            }

            //调用购物车API 如果不为空 则显示购物车入口
            /*RQ.get('cart',{},function(res){
             $scope.cart = res.goods
             })*/

            RQ.get('common/caches/get/cart_' + G.user.id + '_' + G.user.ent_code, {}, function (res) {
                if (res.errcode == 0) {
                    $scope.cart = res.data && JSON.parse(res.data) || {}
                    //console.log($scope.cart)
                }
            })

            $scope.to_cart = function () {
                $location.url('/shop/index/cart')
            }

        }])

    }
})