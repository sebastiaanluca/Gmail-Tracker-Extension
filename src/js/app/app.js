//angular.module('app', ['config', 'errors', 'api', 'session', 'auth', 'vendors', 'directives', 'filters', 'utils'])
angular.module('app', ['config', 'gmail'])
    
    // Log config
.config(['$logProvider', 'Config', function ($logProvider, Config) {
    
    $logProvider.debugEnabled(Config.debug);
    
}]);

// Manually trigger angular
angular.element(document).ready(function () {
    
    // Add controller
    $('body').attr('ng-controller', 'ApplicationController');
    
    // TODO: inject checkbox "Track mail?" + bind to app controller scope variable
    
    // Inject Angular app
    angular.bootstrap(document, ['app']);
    
});