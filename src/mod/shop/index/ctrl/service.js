define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location',function ($scope, $routeParams, RQ, $timeout, $location) {

            F.title('维权')
            F.show_foot_nav($scope)
            $scope.order = {}
            var order_id=$routeParams.orderID;
            //var order_id = 226;
            var images = [
                {"name": "", "url": ""}
            ]
            //获取订单详情
            RQ.get("orders/cusorder/" + order_id, {}, function (res) {
                $scope.order = res.order
            })
            //获取维权类型
            RQ.get("common/datadic/list_by_dictype", {
                dic_type: "serviceType"
            }, function (res) {
                $scope.serviceType = res
            })
            //获取维权原因
            RQ.get("common/datadic/list_by_dictype", {
                dic_type: "seviceReason"
            }, function (res) {
                $scope.serviceReason = res
            })
            //上传图片
//            $scope.onFileSelect = function ($files) {
//                console.log($files)
//                angular.forEach($files, function (v, k) {
//                    $upload.upload({
//                        url: 'https://api.wxpai.cn/file/image/origin/' + G.user.ent_code, // upload.php script, node.js route, or servlet url
//                        //url:"",
//                        method: 'POST',
//                        //headers: {'Authorization': 'xxx'}, // only for html5
//                        //withCredentials: true,
//                        data: {type: 'custom'},
//                        file: v// single file or a list of files. list is only for html5
//                        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
//                        //fileFormDataName: myFile, // file formData name ('Content-Disposition'), server side request form name
//                        // could be a list of names for multiple files (html5). Default is 'file'
//                        //formDataAppender: function(formData, key, val){}  // customize how data is added to the formData.
//                        // See #40#issuecomment-28612000 for sample code
//                    }).progress(function (evt) {
//                        // console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
//                    }).success(function (data, status, headers, config) {
//                        // file is uploaded successfully
//                        // console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
//                    }).error(function (data, status, headers, config) {
//                        console.log(data, status, headers, config)
//                    })
//                })
//            }
            //删除上传图片
            $scope.remove_image = function (index) {
                $scope.form.productImages.splice(index, 1)
            }
            //提交保存维权单
            $scope.add_service = function (form_order) {
                var _form_order = {}
                if (form_order) {
                    if (!form_order.serviceType) {
                        F.tips('请选择处理方式', 1500)
                        //console.log(form_order.serviceType)
                        return
                    }else{
                        _form_order.serviceType = form_order.serviceType;
                    }
                    if (!form_order.serviceReason) {
                        F.tips('请选择维权原因', 1500)
                        return
                    }else{
                        _form_order.serviceReason = form_order.serviceReason.dataValue;
                    }
                    if (!form_order.appRefundAmt) {
                        F.tips('请输入退款金额', 1500)
                        return
                    } else {
                        if (form_order.appRefundAmt<=0||form_order.appRefundAmt>$scope.order.payAmt||!(/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/.test(form_order.appRefundAmt))){
                            F.tips('请输入正确的退款金额', 1500)
                            return
                        }else{
                            _form_order.appRefundAmt = form_order.appRefundAmt;

                        }
                    }
                    if (!form_order.cellPhone || !(/^1[3|4|5|8]\d{9}$/.test(form_order.cellPhone))) {
                        F.tips('请输入有效的手机号码', 1500)
                        return
                    }else{
                        _form_order.cellPhone = form_order.cellPhone;
                    }
                    if(form_order.buyerRemark){
                        _form_order.buyerRemark = form_order.buyerRemark;
                    }else{
                        _form_order.buyerRemark=""
                    }
                } else {
                    F.tips('请输入维权信息', 1500)
                    return
                }
                _form_order.orderID = order_id;
                _form_order.serviceImages = images
                RQ.post('orders/services/apply_service', _form_order, function (res) {
                    if (res && res.errcode == 0) {
                       $location.url('/shop/index/serviceStatus?serviceID='+res.serviceID)
                        //window.location.href='#/shop/index/serviceStatus?serviceID='+res.serviceID;
                    } else {
                        F.tips("提交失败", 3000)
                        return
                    }
                })

            }

        }])
    }
})