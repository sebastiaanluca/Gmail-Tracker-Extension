angular.module('gmail')

.factory('GmailService', ['$rootScope', '$log',
    function ($rootScope, $log) {
        
        $log.debug('GmailService init');
        
        var GmailService = {};
        
        var gmail = new Gmail();
        
        
        
        // When composing a new message or replying
        gmail.observe.on('compose', function (compose, type) {
            // INFO: type can be compose, reply or forward
            $rootScope.$broadcast('compose', compose, type);
        });
        
        // Before the message is sent
        gmail.observe.before('send_message', function (url, body, data, xhr) {
            $rootScope.$broadcast('send_message', url, body, data, xhr);
        });
        
        
        
        GmailService.getUserMail = function () {
            return gmail.get.user_email();
        };
        
        
        
        return GmailService;
        
    }]);