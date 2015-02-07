angular.module('auth.service', ['auth.session'])

.factory('AuthService', ['$rootScope', '$log', '$http', '$q', 'Config', 'AuthSession', 'authService', 'AuthEvents',
    function ($rootScope, $log, $http, $q, Config, AuthSession, authService, AuthEvents) {
        
        var AuthService = {};
        
        
        
        var notAuthenticatedEventHandler = function (event, response) {
            
            $log.debug('AuthService.notAuthenticatedEventHandler()', 'Invalid credentials to access API endpoint: ', response.config.url);
            
            // Only handle event if requesting data from non-OAuth2 API endpoints
            if (response.config.url.endsWith('auth/accesstoken') || response.config.url.endsWith('auth/credentials')) {
                // Do not assist on access token or refresh token request
                return;
            }
            
            AuthService.authenticateAsClient();
            
        };
        
        var authSuccessEventHandler = function () {
            
            $log.debug('AuthService.authSuccessEventHandler()', 'Confirming successful authentication');
            
            // Confirm successful login so the auth interceptor
            // buffer can continue to be executed
            authService.loginConfirmed();
            
        };
        
        
        
        // Handle the possible event where the API denies the user's request
        // and we have to try to refresh the user's token object first
        $rootScope.$on(AuthEvents.authenticationFailed, notAuthenticatedEventHandler);
        
        $rootScope.$on(AuthEvents.clientAuthenticationSuccess, authSuccessEventHandler);
        
        var REQUEST_OPTIONS = {
            ignoreAuthModule: true, // ignore 401 buffering, just fail
            responseType: 'json' // expect application/json
        };
        
        // loosen CORS-checks to within the same domain (subdomains ignored)
        window.domain = window.location.hostname.split('.').slice(1).join('.');
        var loadAccessToken = function (grant) {
            var requestData = {
                client_id: Config.oauth.client_id, // app credential
                client_secret: Config.oauth.client_secret // app secret
            };
            
            for (var key in grant) {
                requestData[key] = grant[key];
            }
            
            return $http.post(Config.api.url + 'auth/accesstoken', requestData, REQUEST_OPTIONS).then(function (result) { // Access token request successful
                
                $log.debug('Access token: ', result.data); // REMOVE
                
                AuthSession.setTokenObject(result.data);
                
                return result.data;
                
            }, function (result) {
                
                AuthSession.destroy();
                
                return $q.reject(result);
                
            });
        };
        
        /**
         * Authenticate the current user as an application to be able to make public requests.
         */
        AuthService.authenticateAsClient = function () {
            
            $log.debug('AuthService.authenticateAsClient()'); // REMOVE
            
            return loadAccessToken({grant_type: 'client_credentials'}).then(function (result) {
                
                $rootScope.$broadcast(AuthEvents.clientAuthenticationSuccess);
                
                return true;
                
            }, function (result) {
                
                // Access token request failed
                $log.debug('Retrieving client app access token failed.', result.data); // REMOVE
                
                $rootScope.$broadcast(AuthEvents.clientAuthenticationFailed);
                
                return $q.reject(result);
                
            });
            
        };
        
        
        
        AuthService.isAuthenticated = function () {
            return !!AuthSession.getTokenObject();
        };
        
        
        
        AuthService.getAccessToken = function () {
            return AuthSession.getTokenObject().access_token;
        };
        
        
        
        return AuthService;
        
    }]);