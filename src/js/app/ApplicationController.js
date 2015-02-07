angular.module('app')

.controller('ApplicationController', ['$scope', '$log',
    function ($scope, $log) {
        
        $log.debug('App controller init');
        
        // Compose
        $scope.$on('compose', function (compose, type) {
            
            $log.debug('compose event!', compose, type);
            
        });
        
        // Send
        $scope.$on('send_message', function (url, body, data, xhr) {
            
            $log.debug('send_message event!', url, body, data, xhr);
            
        });
        
    }]);