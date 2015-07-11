/**
 * Created by Administrator on 2015/5/29.
 */
   //奥贝

define(function (require, exports, module) {

    module.exports =function($scope,wx_share){
           return{
               info: function () {
               //活动说明
                   $scope.secAction.maskShow = true;
                   $scope.secAction.duangShow = true;
                   $scope.secAction.infoShow = true;
               },
               share: function () {
                   //分享
                   $scope.secAction.maskShow = true;
                   $scope.secAction.duangShow = true;
                   $scope.secAction.shareShow = true;
               },
               close: function () {
                   //关闭
                   $scope.secAction.duangShow = false;
//                   var _$scope.secAction = $scope.secAction;
//                   console.log(_$scope.secAction);
                   setTimeout(function () {
                       $scope.secAction.shareShow = false;
                       $scope.secAction.infoShow = false;
                       $scope.secAction.saleOutShow = false;
                       $scope.secAction.secKillListShow = false;
                       $scope.secAction.maskShow = false;
                       $scope.$apply();
                   }, 300)
               },
               saleOut: function () {
                   //秒杀按钮
                   $scope.secAction.maskShow = true;
                   $scope.secAction.duangShow = true;
                   $scope.secAction.saleOutShow = true;
               },
               secKillList: function () {
                   //秒杀列表
                   $scope.secAction.maskShow = true;
                   $scope.secAction.duangShow = true;
                   $scope.secAction.secKillListShow = true;
               },
               init: function () {

                       setTimeout(function () {
                           $('.aubysecskill ').height()
                           if ($('.aubysecskill ').height() <= 480) {
                               $('.aubysecskill ').css('overflow-y', 'auto');
                               $('.goodFooter').height(110);
                           } else {
                               $('.goodFooter').height($('.aubysecskill ').height() - $('.header ').height() - $('.goodContent ').height())
                           }

                       }, 500)
                   wx_share.all({
                       title: '6.1元秒杀价，每日12:00准时开抢，你不来？怪我咯！',
                       desc: '妈妈再也不用担心我的儿童节礼物了！ ',
                       link: 'http://100042.m.wxpai.cn/eshop/v1/index.html',
                       imgUrl: 'http://100042.m.wxpai.cn/eshop/v1/static/image/shop/sharesec.jpg'
                   })
               }

           }
//

    }
})