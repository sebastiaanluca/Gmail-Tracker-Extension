angular.module('errors', [])

.run(['$rootScope', '$log', '$injector', 'AuthEvents',
    function ($rootScope, $log, $injector, AuthEvents) {
        
        // Handle critical token failure
        $rootScope.$on(AuthEvents.clientAuthenticationFailed, function (event) {
            
            $log.debug('Critical app error :(', event);
            
        });
        
    }])
    
    // Debugger
.factory('$exceptionHandler', function () {
    return function (exception, cause) {
        exception.message += ' (caused by "' + cause + '")';
        
        throw exception;
    };
});






