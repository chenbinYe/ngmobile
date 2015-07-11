define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            $scope.test = '你好'
            console.log('123')
            RQ.get('test',{},function(res){
                console.log(res)
                
            })
        }])
    }
})