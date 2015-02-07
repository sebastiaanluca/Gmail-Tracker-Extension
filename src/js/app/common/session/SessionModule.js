angular.module('session', ['LocalStorageModule', 'session.service'])

.config(['Config', 'localStorageServiceProvider',
    function (Config, localStorageServiceProvider) {

        // Set local storage prefix to our unique app identifier
        localStorageServiceProvider.setPrefix(Config.app.identifier);

    }]);