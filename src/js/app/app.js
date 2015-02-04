//angular.module('app', ['config', 'errors', 'api', 'session', 'auth', 'vendors', 'directives', 'filters', 'utils'])
angular.module('app', ['config'])
    
    // Log config
.config(['$logProvider', 'Config', function ($logProvider, Config) {
    
    $logProvider.debugEnabled(Config.debug);
    
}])

.run(['$log',
    function ($log) {
        
        $log.debug('Your app is FUCKING WORKING, bro!');
        
    }]);

// Manually trigger angular
angular.element(document).ready(function () {
    angular.bootstrap(document, ['app']);
});