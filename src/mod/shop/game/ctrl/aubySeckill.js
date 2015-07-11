define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname,['$scope', '$routeParams', 'RQ', '$timeout', '$location',function ($scope, $routeParams, RQ, $timeout, $location) {


            //微信分享自定义
            wx_share.all({
                title:'6.1元秒杀价，每日12:00准时开抢，你不来？怪我咯！',
                desc:'妈妈再也不用担心我的儿童节礼物了！ ',
                link:'http://100042.m.wxpai.cn/eshop/v1/index.html',
                imgUrl:'http://100042.m.wxpai.cn/eshop/v1/static/image/shop/sharesec.jpg'
            })


            $scope.hour_a=0
            $scope.hour_b=0
            $scope.minute_a=0
            $scope.minute_b=0
            $scope.second_a=0
            $scope.second_b=0
            var res_int=0

            var settime=function(){
                var saletime = new Date("2015/05/28 00:00:00").getTime();
                var nowtime= new Date().getTime()

                var leftsecond=(saletime-nowtime)/1000  //计算天数后剩余的毫秒数
                if(leftsecond<=0){
                    clearTimeout(res_int)
                }else{
                    var day1=Math.floor(leftsecond/(60*60*24));
                    var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
                    $scope.hour_a=Math.floor(hour/10)
                    $scope.hour_b=hour%10
                    var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
                    $scope.minute_a=Math.floor(minute/10)
                    $scope.minute_b=minute%10
                    var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
                    $scope.second_a=Math.floor(second/10)
                    $scope.second_b=second%10
                    $scope.$apply()
                }
            }

            $scope.settime=function(){
                res_int=setInterval(settime,1000)
            }
            $scope.settime()
            $scope.$on("$destroy", function () {
                clearTimeout(res_int)
            })

            $scope.aubyAction = {
                info:function(){
                    //活动说明
                    this.maskShow=true;
                    this.duangShow=true;
                    this.infoShow=true;
                },
                share: function () {
                    //分享
                    this.maskShow=true;
                    this.duangShow=true;
                    this.shareShow=true;
                },
                close: function () {
                    //关闭
                    this.duangShow = false;
                    var _this = this;
                    $timeout(function(){
                        _this.shareShow=false;
                        _this.infoShow=false;
                        _this.saleOutShow=false;
                        _this.secKillListShow=false;
                        _this.maskShow=false;
                    },300)
                },
                saleOut:function(){
                    //秒杀按钮
                    this.maskShow=true;
                    this.duangShow=true;
                    this.saleOutShow=true;
                },
                secKillList:function(){
                    //秒杀列表
                    this.maskShow=true;
                    this.duangShow=true;
                    this.secKillListShow=true;
                }
            }

        }])

    }
})