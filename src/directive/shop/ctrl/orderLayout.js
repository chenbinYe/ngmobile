define(function (require, exports, module) {


    module.exports = function(app){
        app.directive('orderLayout',['$timeout',function($timeout) {

            return {
                restrict: "EA",
                transclude:true,
                replace:true,
                templateUrl: G.path.directive + '/shop/view/order-layout.html',
                link: function( scope, element, attrs ) {

                    $timeout(function(){

                    })
                }
            }
        }])

    }
})