define(['zepto'], function () {
    var _func_on_cache = {}
    G.windows_width = $(window).width()
    F = {
        /* img_url : function(product_id,$index,host){
         host = host|| G.api_host
         $index = $index||0
         return host+'/ecomm/products/product_image_url/'+product_id+'/'+$index
         },*/
        //监听函数

        on: function (name, fn) {
            _func_on_cache[name] = fn
        },
        trigger: function (name, once) {
            _func_on_cache[name] && _func_on_cache[name]()
            if (once) {
                this.off(name)
            }
        },
        off: function (name) {
            delete _func_on_cache[name]
        },

        //获取图片
        get_image: function (url, $width, $height, $times) {
            if (!url) return ''
            //return (url && url.indexOf('http') == -1) && G.cdn_host + url || url
            //'http://img2.wxpai.cn/upload/100038_201554_1430731435861_24.jpg@60w_60h_1x.jpg'
            $times = $times || 1
            if (!$width) {
                var windowswidth = $(window).width()
                if (windowswidth <= 320) {
                    url = url + '@320w_1x.jpg'
                }
                else if (windowswidth <= 480) {
                    url = url + '@480w_1x.jpg'
                }
                else if (windowswidth <= 640) {
                    url = url + '@640w_1x.jpg'
                } else {
                    url = url + '@800w_1x.jpg'
                }
                url = (url && url.indexOf('http') == -1) && G.cdn_host + url || url
                url = url.replace('fs.wxpai', 'img2.wxpai')
            } else {
                url = url + '@' + $width + 'w_' + $height + 'h_' + $times + 'x.jpg'
                url = (url && url.indexOf('http') == -1) && G.cdn_host + url || url
                url = url.replace('fs.wxpai', 'img2.wxpai')
            }
            return url
        },
        json_length: function (o) {
            if (o) {
                return Object.keys(o).length
            }
        },
        //获取url 参数
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        //检查设备
        check_device: function () {

            var mobile = 'other'
            var sUserAgent = navigator.userAgent.toLowerCase();

            if (sUserAgent.match(/iphone os/i)) {
                mobile = 'iphone'
            }
            else if (sUserAgent.match(/android/i)) {
                mobile = 'android'
            }
            else if (sUserAgent.match(/ipad/i)) {
                mobile = 'ipad'
            }
            else if (sUserAgent.match(/midp/i)) {
                mobile = 'midp'
            }
            else if (sUserAgent.match(/rv:1.2.3.4/i)) {
                mobile = 'rv'
            }
            else if (sUserAgent.match(/ucweb/i)) {
                mobile = 'ucweb'
            }
            else if (sUserAgent.match(/windows ce/i)) {
                mobile = 'wince'
            }
            else if (sUserAgent.match(/windows mobile/i)) {
                mobile = 'winphone'
            }

            return mobile;
        },

        changeTwoDecimal: function (x) {
            var f_x = parseFloat(x);
            if (isNaN(f_x)) {
                return 0
            }
            var f_x = Math.round(x * 100) / 100;

            return f_x;
        }
    }

})