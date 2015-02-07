angular.module('gmail', [])

.run(['$rootScope', '$log',
    function ($rootScope, $log) {
        
        var gmail = new Gmail();
        
        $log.debug('YAY', gmail.get.user_email());
    
        // When composing a new message or replying
        gmail.observe.on('compose', function (compose, type) {
            // INFO: type can be compose, reply or forward
            $rootScope.$broadcast('compose', compose, type);
        });
        
        // Before the message is sent
        gmail.observe.before('send_message', function (url, body, data, xhr) {
            $rootScope.$broadcast('send_message', url, body, data, xhr);
        });
        
    }]);