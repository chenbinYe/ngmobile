define(function (require, exports, module) {
    module.exports = function (app) {
        require('directive/shop/ctrl/deliveryCheck')(app)

        app.controller(app.cname,['$scope', '$routeParams', 'RQ', '$timeout', '$location',function ($scope, $routeParams, RQ, $timeout, $location) {

            $scope.pageNo = 0;
            $scope.limit = 10;
            $scope.order_list_status = ''
            //$scope.orders = [];
            F.title('我的订单')
            $scope.find = function (order_statu) {

                $scope.order_list_status = order_statu >= 0 ? order_statu : $scope.order_list_status

                if (order_statu >= 0) {
                    $scope.pageNo = 1
                } else {
                    $scope.pageNo++
                }
                ///orders/cusorderlist?shop_id={shop_id}&cus_code={cus_code}

                RQ.get('orders/cusorderlist', {
                    shop_id: G.user.ent_code,
                    cus_code: G.user.id,
                    order_status: $scope.order_list_status,
                    offset: $scope.limit * ($scope.pageNo - 1),
                    limit: $scope.limit
                }, function (res) {
                    if (res && res.errcode == 0) {
                        if(res.orders){
                            if(angular.isArray(res.orders)&&res.orders.length>0) {
                                F.check_shop_id(res.orders[0].shopID, 'cusorderlist', '')
                                $scope.orders = $scope.orders||[]
                                if (order_statu >= 0) $scope.orders = []
                                $scope.orders = $scope.orders.concat(res.orders)
                                $scope._disable_load = $scope.orders.length == res.total ? true : false
                                //console.log($scope.orders)
                            }else{
                                F.tips('没有更多数据了!',1000)
                                $scope._disable_load = true
                            }
                        } else {
                            $scope.orders = []
                        }
                    } else {
                        $scope.orders = []
                    }
                })

                F.on('$service_error',function(){
                    $scope.orders = []
                })
            }

            $scope.show_delivery = 0
            $scope.show_delivery_layout = 0
            $scope.ctrl_show_delivery = function ($index, orderID, delivererName, deliverCode, deliveryCode) {

                $scope.order_deliver = $scope.orders[$index]
                if ($scope.order_deliver.orderDelivery) {
                    $scope.delivererName = $scope.order_deliver.orderDelivery.delivererName
                    $scope.deliverCode = $scope.order_deliver.orderDelivery.delivererCode
                    $scope.deliveryCode = $scope.order_deliver.orderDelivery.deliveryCode
                    //获取物流消息
                    RQ.get('mall/shipping/getDelivery', {
                        type: $scope.deliverCode,
                        postid: $scope.deliveryCode
                        /*                    type: 'shunfeng',
                         postid: '918152035009'*/
                    }, function (res) {
                        F.load(true, 1)
                        $scope.delivery_message = res.data
                        $scope.show_delivery_layout = 1
                        set_height_position()
                        $timeout(function () {
                            $scope.show_delivery = 1
                        }, 300)
                    }, 'http://piplus.wxpai.cn/')
                } else {
                    F.tips('该订单没有物流信息', 1500)
                }
            }


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

            var retrun_height_position = function () {
                $('body')[0].style.height = ''
                $('body')[0].style.overflow = ''
                $('body')[0].style.padding = ''

                $('html')[0].style.height = ''
                $('html')[0].style.overflow = ''
                $('html')[0].style.position = ''
                $("body").scrollTop($scope.bodyOffestHight)
            }

            $scope.ctrl_hide_delivery = function () {
                $scope.show_delivery = 0
                $timeout(function () {
                    $scope.show_delivery_layout = 0
                    retrun_height_position()
                }, 300)
            }


            F.foot_fix($scope)
            F.show_index_nav($scope)
            $scope.find();

            $scope.to_cancel_order = function ($index, $orderID, order) {
                //:TODO 取消订单接口绑定
                var cancel_order = angular.copy($scope.orders[$index]);
                RQ.put('orders/cancelorder/'+$orderID, {}, function (res) {
                    //console.log(res);
                    if (res && res.errcode === 0) {
                        //$scope.orders.splice($index, 1);
                        order.orderStatus = 5;
                        F.tips("取消成功",1500)
                    } else{
                        F.tips("取消失败，请重试",1500)
                    }
                })

            }


        }])
    }
})