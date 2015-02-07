angular.module('auth')

.constant('AuthEvents', {
    clientAuthenticationSuccess: 'auth:client:success',
    clientAuthenticationFailed: 'auth:client:failed',
    
    // Do not change! Part of http-auth-interceptor library.
    authenticationFailed: 'event:auth-loginRequired',
});