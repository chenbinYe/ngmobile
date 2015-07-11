/**
 * Created by Administrator on 2015/5/29.
 */
//奥迪双钻
define(function (require, exports, module) {
    module.exports =function($scope,wx_share){
        var set_height_position = function () {
            //固定页面高度，防止滑动
            $scope.secAction.bodyOffestHight = $('body')[0].scrollTop
            $('body')[0].style.height = $(window).height() + 'px'
            $('body')[0].style.overflow = 'hidden'
            $('body')[0].style.padding = '0px'
            $('html')[0].style.position = 'relative'
            $('html')[0].style.overflow = 'hidden'
            $('html')[0].style.height = $(window).height() + 'px'
            $("body").scrollTop(0)
        }
        return{
            info: function () {
                //活动说明
                $scope.secAction.show_res = 1
                $scope.secAction.show_res_list = 1
                $scope.secAction.show_num = 3
                set_height_position()
            },
            share: function () {
                //分享
                $scope.secAction.show_res = 1
                $scope.secAction.show_res_list = 1
                $scope.secAction.show_num = 2
                set_height_position()
            },
            close: function () {
                //关闭
                $scope.secAction.show_res_list = 0
                setTimeout(function () {
                    $('body')[0].style.height = ''
                    $('body')[0].style.overflow = ''
                    $('body')[0].style.padding = ''
                    $('html')[0].style.height = ''
                    $('html')[0].style.overflow = ''
                    $('html')[0].style.position = ''
                    $("body").scrollTop($scope.secAction.bodyOffestHight)
                    $scope.secAction.show_num = 0
                    $scope.secAction.morepro = 0
                    $scope.secAction.show_res = 0
                    $scope.$apply()
                }, 300)
            },
            saleOut: function () {
                //秒杀按钮失败
                $scope.secAction.show_res = 1
                $scope.secAction.show_res_list = 1
                $scope.secAction.show_num = 1
                set_height_position()
            },
            secKillList: function () {
                //秒杀列表
                $scope.secAction.show_res = 1
                $scope.secAction.show_res_list = 1
                $scope.secAction.morepro = 1
                set_height_position()
            },
            init: function (){
                wx_share.all({
                    title: '儿童节爆款玩具丧心病狂6.1元秒杀！！倒计时现在开始！！',
                    desc: '几块钱的奥迪双钻热销玩具，你到底领不领？！',
                    link: 'http://100038.m.wxpai.cn/eshop/v1/index.html',
                    imgUrl: 'http://100042.m.wxpai.cn/eshop/v1/static/image/shop/sharesec.jpg'
                })
            },
            data:{
                '186':{
                    name:'晶石手表',
                    price:25,
                    salePrice:6.1
                },
                '189':{
                    name:'赤焰战虎',
                    price:25,
                    salePrice:6.1
                },
                '190':{
                    name:'幻灭冥狼',
                    price:30,
                    salePrice:6.1
                },
                '192':{
                    name:'拿瓦搪胶公仔',
                    price:39,
                    salePrice:6.1
                },
                '195':{
                    name:'迷你变形-乐迪',
                    price:25,
                    salePrice:6.1
                },
                '196':{
                    name:'火战卫',
                    price:25,
                    salePrice:6.1
                },
                '198':{
                    name:'烈风光翼',
                    price:65,
                    salePrice:6.1
                }
            }

        }
    }
})