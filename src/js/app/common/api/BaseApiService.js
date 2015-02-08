angular.module('api')

.factory('BaseAPIService', ['$log', 'API',
    function ($log, API) {
        
        // Create an API Restangular endpoint service thingamagig
        var BaseService = function (endpoint) {
            this.repository = API.service(endpoint);
        };
        
        
        
        // Get the real data, screw Restangular
        BaseService.prototype.clean = function (promise) {
            return promise.then(function (response) {
                
                $log.debug('[BaseApiService]', 'Raw response:', response);
                
                // Works for objects AND arrays! Yay.
                return response.plain();
                
            });
        };
        
        
        
        /**
         * Validate an ID to prevent invalid API calls.
         *
         * @param id
         */
        var validate = function (id) {
            
            // Check if the ID is set (integer or string)
            if (id == null) {
                throw new Error('[BaseApiService] The provided ID is not an integer! (' + id + ')');
            }
            
        };
        
        
        
        // Get a list of records
        BaseService.prototype.all = function () {
            return this.clean(this.repository.getList());
        };
        
        // Get a list of sub records
        BaseService.prototype.allSub = function (id, sub, params) {
            return this.clean(this.repository.one(id).getList(sub, params));
        };
        
        
        
        // Get a single record
        BaseService.prototype.get = function (id) {
            validate(id);
            
            return this.clean(this.repository.one(id).get());
        };
        
        // Get a single sub record
        BaseService.prototype.getSub = function (id, sub, subId, params) {
            validate(id);
            validate(subId);
            
            return this.clean(this.repository.one(id).one(sub, subId).get(params));
        };
        
        
        
        // Create a new record
        BaseService.prototype.post = function (attributes) {
            return this.clean(this.repository.post(attributes));
        };
        
        // Create a new sub record
        // TODO: test me
        BaseService.prototype.postSub = function (id, sub, attributes) {
            validate(id);
            
            return this.clean(this.repository.one(id).all(sub).post(attributes));
        };
        
        
        
        // Update a single record
        BaseService.prototype.patch = function (id, attributes) {
            validate(id);
            
            return this.clean(this.repository.one(id).patch(attributes));
        };
        
        // Update a single sub record
        BaseService.prototype.patchSub = function (id, sub, subId, attributes) {
            validate(id);
            validate(subId);
            
            return this.clean(this.repository.one(id).one(sub, subId).patch(attributes));
        };
        
        
        
        // Replace a single record
        BaseService.prototype.put = function (id, attributes) {
            validate(id);
            
            return this.clean(this.repository.one(id).put(attributes));
        };
        
        // Replace a single sub record
        BaseService.prototype.putSub = function (id, sub, subId, attributes) {
            validate(id);
            validate(subId);
            
            return this.clean(this.repository.one(id).one(sub, subId).put(attributes));
        };
        
        
        
        // Delete a record
        BaseService.prototype.destroy = function (id) {
            validate(id);
            
            return this.clean(this.repository.one(id).remove());
        };
        
        // Delete a sub record
        // TODO: test me
        BaseService.prototype.destroySub = function (id, sub, subId) {
            validate(id);
            validate(subId);
            
            return this.clean(this.repository.one(id).one(sub, subId).remove());
        };
        
        
        
        return BaseService;
        
    }]);