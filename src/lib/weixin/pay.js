define(function (require, exports, module) {



    module.exports =  function ($scope) {

        var open_id = G.user.openId,
            appId = G.user.appId,
            pay_host = G.wx_config_host

        return function(orderNo){
            orderNo = orderNo||new Date().getTime() + '';
            var data = {
                "attach": "支付测试",
                "body": "JSAPI支付测试",
                "openid": open_id,
                "out_trade_no": "20150424" + orderNo,
                "spbill_create_ip": "14.23.150.211",
                "total_fee": "1"
            }

            $scope.wx_to_pay_click = 1

            $.ajax({
                type: "POST",
                contentType: "application/json",
                dataType: "json", //表示返回值类型，不必须
                data: JSON.stringify(data),
                url: pay_host+"payment/prepay?appId="+appId,
                success: function (rs) {
                    if (rs.errcode === 0) {
                        wx.chooseWXPay({
                            "appId": appId,
                            "nonceStr": rs.data.nonceStr,
                            "package": rs.data.package,
                            "signType": "MD5",
                            "paySign": rs.data.paySign,
                            "timestamp": rs.data.timestamp,
                            success: function (res) {
                                //alert(res);
                                $scope.order.orderStatus = 2
                                $scope.$apply()
                            }
                        })
                    }

                    $scope.wx_to_pay_click = 0
                    $scope.$apply()
                },
                error: function () {
                    F.tips('执行失败',1500)
                    $scope.wx_to_pay_click = 0
                    $scope.$apply()
                }
            })
        }

    }


    /*    var title = "微信分享"
     var open_id = 'oEimujomUEII_P56nZsVVdx0B6Mw'

     wx.ready(function () {

     // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
     wx.onMenuShareTimeline({
     title: title, // 分享标题
     link: 'http://piplus.wxpai.cn/sam/aofeiNewYear/game/ee578c466ec4b1194078f8d5378875eb', // 分享链接
     imgUrl: 'http://fs.wxpai.cn/aofeiNewYear/share.jpg', // 分享图标
     success: function () {
     // 用户确认分享后执行的回调函数
     },
     cancel: function () {
     // 用户取消分享后执行的回调函数
     }
     })

     wx.onMenuShareAppMessage({
     title: title, // 分享标题
     desc: '对着电视摇一摇，领羊年压岁礼包！', // 分享描述
     link: 'http://piplus.wxpai.cn/sam/aofeiNewYear/game/ee578c466ec4b1194078f8d5378875eb', // 分享链接
     imgUrl: 'http://fs.wxpai.cn/aofeiNewYear/share.jpg', // 分享图标
     type: '', // 分享类型,music、video或link，不填默认为link
     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
     success: function () {
     // 用户确认分享后执行的回调函数
     },
     cancel: function () {
     // 用户取消分享后执行的回调函数
     }
     })
     })*/
})