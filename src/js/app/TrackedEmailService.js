angular.module('app')

.factory('TrackedEmailService', ['BaseAPIService',
    function (BaseAPIService) {
        
        // Initialize a BaseService with the correct API endpoint
        return new BaseAPIService('tracked_emails');
        
    }]);