/**
 * Created by ken on 15/4/21.
 */
define(['angular'],function (require, exports, module) {

  angular.module('app').service('RQ', ['$http', '$cacheFactory', function ($http, $cacheFactory){

        //缓存管理
        //var $httpDefaultCache = $cacheFactory.get($http);

        // var config_host = G.api_host
        // var _ext = '.json'
        // var config_host = G.api_host
        // var _ext = G.api_host_ext||''

        var config_host = './data/'
        var _ext = '.json'

        /**
         * 通用POST GET的方法 API层需要通过 $.param 进行序列化
         * @param url api链接
         * @param rq  请求 JSON
         * @param cb  回调函数
         * @param cache 是否清除缓存
         * @param host 是否更换主机
         */

        this.get = function (url, rq, cb, host, cache) {
            host = host || config_host;

            url = url.indexOf(_ext) > -1 ? host + url : host + url + _ext
            if (!$.isEmptyObject(rq)) {
                url = (url.indexOf('?') > -1) ? url + '&' + $.param(rq) : url + '?' + $.param(rq)
            }
            url = (!cache) ? url : ((url.indexOf('?') == -1) ? url + '?' + Math.random() : url + '&' + Math.random());
            $http.get(url).success(function (d) {
                cb(d)
            })
        }

        this.post = function (url, rq, cb, host) {
            host = host || config_host;

            url = url.indexOf(_ext) > -1 ? host + url : host + url + _ext
            $http.post(url, rq).success(function (d) {
                cb(d)
            })
        }

        this.put = function (url, rq, cb, host) {
            host = host || config_host;

            url = url.indexOf(_ext) > -1 ? host + url : host + url + _ext
            $http.put(url, rq).success(function (d) {
                cb(d)
            })
        }

        this.delete = function (url, rq, cb, host) {
            host = host || config_host;
            url = url.indexOf(_ext) > -1 ? host + url : host + url + _ext
            $http.delete(url, rq).success(function (d) {
                cb(d)
            })
        }

    }])

      .factory('requestCheckLine',['$q', '$rootScope', '$timeout', '$window', '$location', function ($q, $rootScope, $timeout, $window, $location) {


          return {
              'responseError': function (rejection) {
                  // do something on error
                  if (rejection.status === 404) {
                      /*F.load('找不到响应的资源',1500)*/
                      return $q.reject(rejection);
                  }

                  if (rejection.status === 403) {
                      // $F.load('无权访问',1000)
                      return $q.reject(rejection);
                  }

                  if (rejection.status === 406) {
                      // $F.load('无权访问',1000)
                      F.tips(true, 3000)
                      F.load(true, 3000)
                  }

                  if (rejection.status === 422) {
                      return $q.reject(rejection);
                  }

                  F.trigger('$service_error',true)
              },
              request: function (request) {
                  /*if (G.user && G.user.token) {
                   request.headers = request.headers || {};
                   request.headers.token = G.user.token;
                   }*/
                  if(request.url.indexOf('.html')==-1){
                      //console.log(request)
                      F.load('加载中，请稍候......')
                  }

                  return request;
              },
              response: function (response) {
                  if(response.data&&'undefined'!==typeof response.data.errcode){
                      F.load(true,1)
                  }

                  // 验证错误 -1

                  //console.log(response)
                  /*if (response.data.status === -1 && 'undefined' !== typeof response.data.message) {
                   F.alert(response.data.message)

                   //操作失败 0
                   } else if (response.data.status === 0 && 'undefined' !== typeof response.data.message) {
                   F.alert(response.data.message)
                   }*/

                  return response;

              }
          };

      }])

})