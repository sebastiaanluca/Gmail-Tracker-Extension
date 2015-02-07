angular.module('api.service', [])

.constant('ApiEvents', {
    apiRequestStarted: 'api:request:started',
    apiRequestFinished: 'api:request:finished'
})

.factory('API', ['$rootScope', '$location', '$log', 'Config', 'Restangular', 'ApiEvents',
    function ($rootScope, $location, $log, Config, Restangular, ApiEvents) {
        
        return Restangular.withConfig(function (RestangularConfigurator) {
            
            // Set API base URL from configuration file
            RestangularConfigurator.setBaseUrl(Config.api.url);
            
            // Bind some cool events
            RestangularConfigurator.setRequestInterceptor(function (element, operation, route, url) {
                $rootScope.$broadcast(ApiEvents.apiRequestStarted);
                
                // Just pass this through without making changes
                return element;
            });
            
            RestangularConfigurator.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                $rootScope.$broadcast(ApiEvents.apiRequestFinished);
                
                // Just pass this through without making changes
                return data;
            });
            
            RestangularConfigurator.setErrorInterceptor(function (response, deferred, responseHandler) {
                $rootScope.$broadcast(ApiEvents.apiRequestFinished);
                
                $log.debug('API request failed', response.config.url, response.status + ' - ', response.data);
                
                // Return true to indicate error has not been handled
                return true;
            });
            
            // Intercept and parse API response
            RestangularConfigurator.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                // Return the core data
                // Fixes Restangular nagging about getList() not returning an array, ugh
                return data.data;
            });
            
        });
        
    }]);