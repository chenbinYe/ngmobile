define(function (require, exports, module) {
    module.exports = function(app){
        app.controller(app.cname,['$scope', '$routeParams', 'RQ', '$timeout', '$location',function ($scope, $routeParams, RQ, $timeout, $location) {

            F.title('维权状态')
            F.show_foot_nav($scope)
            $scope.order = {}
            var serviceID=$routeParams.serviceID
            //console.log(serviceID)
            //var serviceID=11

            //获取维权单信息
            RQ.get("orders/services/"+serviceID, {}, function (res) {
                $scope.serviceDetail=res
                //console.log(res);
            })
            //获取物流公司信息(目前是前端自己的json解析，以后会有一个接口来获取物流)
            RQ.get("deliverers.json", {}, function (res) {
                $scope.deliverers=res.deliverers
            },'./site/')
            //添加物流信息
            $scope.form_order = {}
            $scope.add_delivery=function(form_order){
                var _form_order = {}
                //console.log(form_order)
                if(form_order.deliveryCode&&form_order.deliverers){
                    _form_order.delivererCode=form_order.deliverers.delivererCode
                    _form_order.delivererName=form_order.deliverers.delivererName
                    _form_order.deliveryCode=form_order.deliveryCode
                }else{
                    F.tips("请输入物流信息",1500)
                    return
                }
                //console.log(_form_order)
                RQ.put('orders/services/return_delivery/'+serviceID, _form_order, function (res) {
                    if(res&&res.errcode==0){
                        $scope.serviceDetail.service.serviceStatus=2
                        $scope.serviceDetail.service.delivererName=_form_order.deliveryCode
                        $scope.serviceDetail.service.deliveryCode=_form_order.delivererName
                    }
                })
            }
            //关闭维权申请
            $scope.cancel_service=function(){
                F.confirm("退款申请提示","你确定要关闭退款申请?")
//                RQ.put("orders/services/cancel_service/"+serviceID,{},function(res){
//                    if(res&&res.errcode==0){
//                        F.tips("关闭成功",1500)
//                        $scope.serviceDetail.service.serviceStatus=6
//                    }else{
//                        F.tips("关闭失败，请重试",1500)
//                    }
//                })
            }
            //接收确认或者取消信息
            $scope.$on('confirmOrder',function(event,data){
                if(data==1){
                    RQ.put("orders/services/cancel_service/"+serviceID,{},function(res){
                        if(res&&res.errcode==0){
                            F.tips("关闭成功",1500)
                            $scope.serviceDetail.service.serviceStatus=6
                        }else{
                            F.tips("关闭失败，请重试",1500)
                        }
                    })
                }else{
                    return
                }
            })

        }])
    }
})