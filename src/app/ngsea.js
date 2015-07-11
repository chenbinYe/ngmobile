/**
 * ngSea VerSion 0.6.1
 * Author by ckken email ckken@qq.com
 */
define(['angular'],function (require, exports, module) {

    angular.module('ngsea', [], ["$controllerProvider", "$compileProvider", "$filterProvider", "$provide",
        function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
            $provide.factory('$ngsea', ['$rootScope', '$q', '$location', function ($rootScope, $q, $location) {
                return function (app, settings) {

                    $rootScope.activeApply = function (fn) {
                        var phase = this.$root.$$phase;
                        if (phase == '$apply' || phase == '$digest') {
                            if (fn && (typeof(fn) === 'function')) {
                                fn();
                            }
                        } else {
                            this.$apply(fn);
                        }
                    };

                    var defaults = {
                        tpl_path: seajs.data.base + 'src/mod/',
                        tpl_ext: '.html',
                        mod_path: 'mod/',
                        module: 'home',
                        controller: 'index',
                        action: 'index',
                        version:''
                    }
                    angular.extend(defaults, settings)


                    var register = {
                        controller: $controllerProvider.register,
                        directive: $compileProvider.directive,
                        filter: $filterProvider.register,
                        factory: $provide.factory,
                        service: $provide.service,
                        decorator: $provide.decorator
                    }


                    $rootScope.$on('$routeChangeStart', function (e, target) {
                        //console.log(e, target)
                        var route = target && target.$$route || {};
                        angular.extend(route, route_format(target.params))
                        route.resolve = route.resolve || {};
                        route.resolve.loadedModule = function () {
                            var deferred = $q.defer();
                            seajs.use(route.controllerUrl, function (m) {
                                $rootScope.activeApply(function () {
                                    if (angular.isUndefined(m)) {
                                        deferred.reject(m);
                                        //$location.path('/')
                                        $location.url('/')
                                    } else {
                                        //console.log('resolve')
                                        register.cname = route.cname
                                        deferred.resolve(angular.isFunction(m) ? m(register, app) : m);
                                    }
                                });
                            });

                            return deferred.promise;
                        }
                    })


                    var route_format = function (params) {
                        params.module = params.module || defaults.module
                        params.controller = params.controller || defaults.controller
                        params.action = params.action || defaults.action
                        return {
                            controller: params.module + '_' + params.controller + '_' + params.action,
                            templateUrl: defaults.tpl_path + params.module + '/' + params.controller + '/view/' + params.action + defaults.tpl_ext+'?v='+defaults.version,
                            controllerUrl: defaults.mod_path + params.module + '/' + params.controller + '/ctrl/' + params.action,
                            cname: params.module + '_' + params.controller + '_' + params.action
                        }
                    }


                }

            }])
        }])
})
