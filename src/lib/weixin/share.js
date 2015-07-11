define(function (require, exports, module) {



    module.exports =  {
        all:function(opt,success,cancel){

            var op = {
                title:'',
                link:'',
                imgUrl:'',
                desc:'',
                type:'',
                dataUrl:''
            }
            success = success||function(){}
            cancel = cancel||function(){}

            angular.extend(op,opt)

            //分享给朋友圈
            wx.onMenuShareTimeline({
                title: op.title, // 分享标题
                link: op.link, // 分享链接
                imgUrl: op.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    success()
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    cancel()
                }
            });
            //分享给朋友
            wx.onMenuShareAppMessage({
                title: op.title, // 分享标题
                desc: op.desc, // 分享描述
                link: op.link, // 分享链接
                imgUrl: op.imgUrl, // 分享图标
                type: op.type, // 分享类型,music、video或link，不填默认为link
                dataUrl: op.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    success()
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    cancel()
                }
            });

            //分享到QQ
            wx.onMenuShareQQ({
                title: op.title, // 分享标题
                desc: op.desc, // 分享描述
                link: op.link, // 分享链接
                imgUrl: op.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    success()
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    cancel()
                }
            });

            //分享到腾讯微博
            wx.onMenuShareWeibo({
                title: op.title, // 分享标题
                desc: op.desc, // 分享描述
                link: op.link, // 分享链接
                imgUrl: op.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    success()
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    cancel()
                }
            });
        }
    }

})