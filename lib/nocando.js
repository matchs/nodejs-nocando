var FastMap = require('collections/fast-map');
var Monads = require('monads');
var AuthList = new FastMap();



var Auth = {  


};


var saveAuthorization = function(list, action, context, authorization, resource_provider, authorized_resource_provider){
    auth = new Auth();
    auth.action = action;
    auth.auth = authorization;
    auth.resource_provider = resource_provider;
    auth.authorized_resource_provider = authorized_resource_provider;

    if(!list.has(context)){
        list.set(context, auth);        
    } else {
        // throw a exception or return some kind of error
    }
};

/**
 *
 *
 *@param action
 *@param context
 *@param authorization
 *@param app_context_provider
 *@param app_resource_provider
 */
var can = function(action, context, authorization, resource_provider, authorized_resource_provider){
    saveAuthorization(AuthList, action, context, authorization, resource_provider, authorized_resource_provider);   
    //return Monad.state 
};

/**
 *
 *
 */
var and = function(){
    var methods = arguments;
    return function(user, app_context, app_resource){
        return Object.keys(methods).reduce(function(acc, curr){
            return acc && methods[curr](user, app_context, app_resource);
        }, true);
    };
};

/**
 *
 *
 */
var or = function(){
    var methods = arguments;
    return function(user, app_context, app_resource){
        return Object.keys(methods).reduce(function(acc, curr){
            return acc || methods[curr](user, app_context, app_resource);
        }, false);
    };
};


/**
 *
 *
 */
var not = function(authorization){
    return function(user, app_context, app_resource){
        return true && !authorization(user, app_context, app_resource);
    };
};

/**
 *
 *
 */
var revoke = function(action, context){};

/**
 *
 *
 */
var override = function(action, context, app){

};

/**
 *
 *
 */
var can_i = function(action, context, user, app_context){

    return {
        result : true,
        

    };
};

/**
 *
 *
 *@param action
 *@param context
 *@param user
 *@param app_context
 *
 *@return MaybeMonad
 */
var authorize = function(action, context, user, app_context){
        
    
    
    return new Monads.Maybe(resource);
};


module.exports.authorize = authorize;
module.exports.can = can;
module.exports.and = and;
module.exports.or = or;
module.exports.not = not;
module.exports.revoke = revoke;
module.exports.override = override;
