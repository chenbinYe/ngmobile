define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname,['$scope', '$routeParams', 'RQ', '$timeout', '$location',function ($scope, $routeParams, RQ, $timeout, $location) {
            F.title(G.site.name);

            $location.url('/shop/' + G.user.ent_code + '/liuyi')
            F.foot_fix($scope)
            F.show_index_nav($scope)
        }])

    }
})