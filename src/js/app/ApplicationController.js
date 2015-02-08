angular.module('app')

.controller('ApplicationController', ['$scope', '$log', 'Config', 'GmailService', 'TrackedEmailService',
    function ($scope, $log, Config, GmailService, TrackedEmailService) {
        
        $log.debug('App controller init');
        
        $log.debug('Gmail address is', GmailService.getUserMail());
        
        // Compose
        $scope.$on('compose', function (event, args) {
            
            $log.debug('compose event', args);
            
        });
        
        // Send
        $scope.$on('send_message', function (event, args) {
            
            // TODO: if something fails here, it won't throw an error (not a single one)
            
            $log.debug('[ApplicationController] send_message event, injecting pixel and creating email tracking entry');
            
            var msg = args.xhr.xhrParams.body_params;
            var trackingID = generateRandomString(32);
            
            // Inject tracking pixel
            msg.body = msg.body + '<img src="https://tracker.' + Config.domain + '/track/' + trackingID + '" alt="" />';
            
            $log.debug('[ApplicationController] send_message event ', args.data);
            
            var email = {
                id: trackingID,
                
                from: args.data.from,
                to: args.data.to,
                subject: args.data.subject,
                
                is_html: args.data.ishtml,
                has_read_receipt: args.data.readreceipt
            };
            
            // Check for optional values
            if (!isBlank(args.data.composeid)) {
                email.gmail_msg_id = args.data.composeid;
            }
            
            if (!isBlank(args.data.cc)) {
                email.cc = args.data.cc;
            }
            
            if (!isBlank(args.data.bcc)) {
                email.bcc = args.data.bcc;
            }
            
            // Remove empty recipients
            for (var i = 0; i < email.to.length; ++i) {
                if (isBlank(email.to[i])) {
                    email.to.splice(i, 1);
                    i--;
                }
            }
            
            // Send everything to the API
            TrackedEmailService.post(email).then(function (response) {
                $log.debug('API test call response: ', response);
            });
            
        });
        
    }]);