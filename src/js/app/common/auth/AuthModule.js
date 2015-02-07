angular.module('auth', ['auth.service', 'auth.session', 'http-auth-interceptor'])

.run(['$rootScope', '$injector', '$log', 'AuthEvents', 'AuthService',
    function ($rootScope, $injector, $log, AuthEvents, AuthService) {
        
        // Add OAuth2 token to header for all
        // $http and Restangular calls
        $injector.get('$http').defaults.transformRequest = function (data, headersGetter) {
            
            if (AuthService.isAuthenticated()) {
                //$log.debug('You\'re authenticated. Adding access token to HTTP request: ' + AuthService.getAccessToken());
                headersGetter().Authorization = 'Bearer ' + AuthService.getAccessToken();
            }
            
            if (data) {
                // IMPORTANT! DO NOT OMIT!
                // Parses request data to JSON so the API actually understands it
                return angular.toJson(data);
            }
            
        };
        
    }]);