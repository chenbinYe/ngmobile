define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            F.title(G.site.name);
            RQ.get('common/caches/get/aubyFlag', {}, function (res) {
                //没有缓存时,进行缓存
                if (!res.data || res.data !== 'true') {
                    RQ.get('auby.json', {}, function (res) {
                        angular.forEach(res, function (value, key) {
                            RQ.post('common/caches/set/' + key, value, function (res) {

                            })
                        })
                    }, './site/')
                }
            })

            F.foot_fix($scope)
            F.show_index_nav($scope)
            //秒殺導航
            F.show_ms_nav($scope)
        }])

    }
})