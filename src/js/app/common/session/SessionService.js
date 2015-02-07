angular.module('session.service', [])

.factory('Session', ['localStorageService',
    function (localStorageService) {

        // Just return the library module we're using
        // as this service acts more as an easy access point
        return localStorageService;

    }]);