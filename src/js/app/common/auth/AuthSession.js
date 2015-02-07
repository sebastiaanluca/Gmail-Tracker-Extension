angular.module('auth.session', ['session'])

.service('AuthSession', ['$log', 'Session',
    function ($log, Session) {
        
        this.setTokenObject = function (tokenObject) {
            Session.set('client.tokenObject', tokenObject);
        };
        
        this.getTokenObject = function () {
            return Session.get('client.tokenObject');
        };
        
        this.destroyTokenObject = function () {
            Session.remove('client.tokenObject');
        };
        
        
        
        this.destroy = function () {
            $log.debug('Destroying session');
            
            this.destroyTokenObject();
        };
        
    }]);