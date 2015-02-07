angular.module('app')

.controller('ApplicationController', ['$scope', '$log', 'GmailService', 'TrackedEmailService',
    function ($scope, $log, GmailService, TrackedEmailService) {
        
        $log.debug('App controller init');
        
        $log.debug('Gmail address is', GmailService.getUserMail());
        
        // Compose
        $scope.$on('compose', function (compose, type) {
            
            $log.debug('compose event', compose, type);
            
        });
        
        // Send
        $scope.$on('send_message', function (url, body, data, xhr) {
            
            $log.debug('send_message event', url, body, data, xhr);
            
            // Inject tracking pixel
            var msg = xhr.xhrParams.body_params;
            var id = generateRandomString(32);
            msg.body = msg.body + '<img src="http://tracker.sebastiaanluca.dev/track/' + id + '" alt="" />';
            
            console.log('From', data.from);
            console.log('To', data.to);
            console.log('CC', data.cc);
            console.log('BCC', data.bcc);
            console.log('Subject', data.subject);
            console.log('Message', data.body);
            console.log('Is HTML?', data.ishtml);
            console.log('Request read receipt?', data.readreceipt);
            console.log('Gmail message id', data.composeid);
            
            // TODO: POST id, critical data, and metadata to API
            
        });
        
        
        
        // API test call
        TrackedEmailService.post({
            id: 'xSHzlG6UnIi0ncrVaym3bFgn32tYFare',
            to: 'derp@sebastiaanluca.com'
        }).then(function (response) {
            
            $log.debug('API test call response: ', response);
            
        });
        
    }]);