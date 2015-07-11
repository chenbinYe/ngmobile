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


            $scope.sku_key = []
            $scope.sku_value = {}

            $scope.order = {
                num: 1,
                id: $scope.id
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
                    if ($scope.product.freight && $scope.product.freight.promotionID) {
                        $scope.freight = $scope.product.freight
                        /*RQ.get('freights/' + $scope.product.freight.freightID, {}, function (res) {
                         if (res && res.errcode == 0 && res.freight.freightID > 0) {
                         $scope.freight = res.freight || {}
                         }
                         })*/
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
                F.tips('订单提交中，请稍候...', 0, true)
                var orderSubs = [
                    {
                        skuID: $scope.order.skuID || 0,
                        productID: $scope.id,
                        qty: $scope.order.num
                    }
                ]

                var order = {
                    shopID: G.user.ent_code,
                    openID: G.user.openId,
                    cusCode: G.user.id,
                    cusName: G.user.name,
                    orderSubs: orderSubs
                }
                //console.log(order)
                // RQ.get("createOrder", order, function(res){
                RQ.post("orders/buynow", order, function (res) {
                    //console.log(res)
                    if (res && res.errcode == 0) {
                        F.tips(true, 1500)
                        $location.url('/shop/index/order?id=' + res.order.orderID);
                    } else {
                        alert('添加失败，请重试')
                    }
                })
            }

            //添加商品到购物车
            $scope.add_to_order = function (order) {
                var tempArr = [
                    {
                        productID: order.id,
                        skuID: order.skuID | 0,
                        qty: order.num
                    }
                ]
                RQ.put('carts/add_product?shop_id=' + G.user.ent_code + '&cus_code=' + G.user.id, {
                    shopID: G.user.ent_code,
                    cusCode: G.user.id,
                    cartSubs: tempArr
                }, function (res) {
                    if (res.errcode == 0) {
                        $scope.cart_count = res.cartSubCount
                        $timeout(function () {
                            F.tips('成功添加到购物车', 1500)
                            F.detal.ctrl_sku_close()
                        }, 10)
                    }
                })
            }

            //新购物车
            RQ.get('carts/get_count?cus_code=' + G.user.id + '&shop_id=' + G.user.ent_code, {}, function (res) {
                if (res.errcode == 0) {
//                    console.log(res)
                    $scope.cart_count = res.cartSubCount
                    //console.log($scope.cart)
                }
            })


            $scope.to_cart = function () {
                $location.url('/shop/index/cart')
            }

        }])

    }
})