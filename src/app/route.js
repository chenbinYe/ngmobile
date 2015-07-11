/**
 * Created by Game-netease on 2014/11/4.
 */
define(['angular'],function (require, exports, module) {


    angular.module('app')

        .config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider) {

            $routeProvider
                .when('/',{})
                .when('/:module',{})
                .when('/:module/',{})
                .when('/:module/:controller',{})
                .when('/:module/:controller/',{})
                .when('/:module/:controller/index',{})
                .when('/:module/:controller/:action',{})

            $httpProvider.interceptors.push('requestCheckLine')

        }])
})