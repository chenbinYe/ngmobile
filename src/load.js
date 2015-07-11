/**
 * Created by Game-netease on 2014/11/4.
 */



seajs.config({

    base: G.path.root,
    alias: {
        'angular': 'lib/common/angular.js',
        'jquery': 'lib/common/jquery.js',
        'zepto': 'lib/common/zepto.js',
        'frozen': 'lib/common/frozen.js',
    },
    'map': [[/^(.*\.(?:css|js))(?!\?)(.*)$/i, '$1?' + G.load_version]],

    paths: {
        'app': 'src/app',
        'mod': 'src/mod',
        'lib': 'src/lib',
        'common': 'src/lib/common',
        //'weixin': 'src/lib/weixin',
        'plugin': 'src/lib/plugin',
        'directive': 'src/directive'
    }
});


var _get_ent_code = function (name) {

    var a = window.location.host
    a = a&& a.split('.')[0]||null
    a = parseInt(a)
    //防止debug后产生错误提示 默认shop id为大于等于六位数
    if(!a|| a<99999){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    return a
}

//获取商城的ent_code
//G.query.ent_code = parseInt(_get_ent_code('ent_code')) || '100038'


//基础库加载
seajs.use([
    'zepto',
    'app/function',
    'lib/common/store',
  //  'site/' + G.query.ent_code//获取商城对应的静态数据
], function () {

    //测试数据 debug 模式
    if (G.debug) {
        if (G.debug === 2) {
            G.user = {
                id: 1,
                name: 'ken',
                ent_code: G.query.ent_code
            }
        }
        G.api_host = 'http://172.18.6.198:8080/ecomm/'
        //G.cdn_host = 'http://dev.fs.wxpai.cn/'
        G.load_version = Math.random()
    }

    //定位到授权页面获取授权信息
    var _cb_to_oauth = function (data) {
        var clientToken = data.client_token
        store.set('client-token-' + G.query.ent_code, clientToken)
        store.set('goto_hash', window.location.hash)
        window.location.href = G.wx_config_host + 'oauth2/go?entCode=' + G.query.ent_code + '&clientToken=' + clientToken + '&rmd=' + Math.random()
    }
//angular 模块库加载
    var bootstrap_ng = function () {
        seajs.use([
           // 'frozen',
            'angular',
            'common/angular-route',
            'common/angular-sanitize',
            'app/ngsea',
            'app/app',
            'app/route',
            'app/directive',
            'app/service'
        ], function () {
            //console.log('bootstrap_ng')
            angular.bootstrap(document, ["app"])
            //初始化微信函数
            if (G.debug != 2){
                seajs.use([
                    //G.wx_config_host + 'jsapi/config.js?appId=' + G.user.appId + '&isDebug=false',
                    //G.site.tongji
                ])
            }
        })
    }
    //定义网站头
    G.site_name = G.site.name || G.site_name
    if (G.debug != 2)G.user = store.get('user_' + G.query.ent_code) || false
    //token操作
    var localToken = store.get('client-token-' + G.query.ent_code) || false
    if ((!G.user || G.user.version != G.user_version || !localToken) && G.debug != 2  && 1==0) {
        //请求新数据
        $.ajax({
            //url: G.paiplus_host + 'app/member/' + G.query.ent_code + '/openApi/get?rmd=' + Math.random(),
            url: G.wx_config_host + 'client/info?rmd=' + Math.random(),
            headers: {'X-Client-Token': localToken},
            success: function (res) {
                if (res.errcode === 0) {
                    if (res.data && res.data.user) {

                        //用户全局赋值
                        G.user = res.data.user
                        G.user.name = G.user.name || G.user.nickName
                        G.user.id = G.user.id || G.user.mid
                        G.user.version = G.user_version
                        G.user.appId = res.data.enterprise.appId
                        G.user.ent_code = res.data.enterprise.ent_code
                        store.set('user_' + G.query.ent_code, G.user)
                        //启动angular操作
                        bootstrap_ng()
                        //判断是否需要定位到特定的页面
                        var goto_hash = store.get('goto_hash') || false
                        if (goto_hash) {
                            window.location.hash = goto_hash
                            store.remove('goto_hash')
                        }
                    } else {
                        _cb_to_oauth(res.data)
                    }
                } else {
                    _cb_to_oauth(res.data)
                }
            },
            error: function (e) {
                console.log('load api error', e)
            }
        })
    } else {
        //G.user.ent_code = G.query.ent_code
        //启动angular操作
        bootstrap_ng()

    }

})