define(function (require, exports, module) {


    module.exports = function(app){
        app.directive('orderList',['$timeout',function($timeout) {

            return {
                restrict: "EA",
                transclude:true,
                replace:true,
                templateUrl: G.path.directive + '/shop/view/order-list.html',
                link: function( scope, element, attrs ) {

                    $timeout(function(){

                    })
                }
            }
        }])

    }
})