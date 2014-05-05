Collections = require('collections');
FastMap = Collections.FastMap;
AuthList = new FastMap();



var Auth = {  


};

/**
 * A Maybe Monad - Allows chainable calls and encapsulates empty/null/undefined values verification
 * @see http://sean.voisen.org/blog/2013/10/intro-monads-maybe/
 *
 * @param value Some value of any type
 * @return MaybeMonad Can be 'something' or 'nothing'
 */
var MaybeMonad = function(value){
    var nothing = {

        /**
         * 
         *
         */
        bind : function(fn){
            return this;
        },

        /**
         *
         * @param def A default value to be returned in case of nothing
         * @param fn A transformation to be applied over the value in case of something 
         */
         maybe : function(def, fn){
          return def;
        }
    };

    /**
     * 
     *@param value 
     *@return 
     */
    var something = function(value){
        return {
            /**
             *
             *
             */
            bind : function(fn){
                MaybeMonad(fn.call(this, value));
            },
            
            /**
             *
             *
             */
            maybe : function(def, fn){
                return fn.call(this, value);
            }
        };
    };

    if(value === null || value === undefined || typeof value === 'undefined' || value.lenght && value.lenght <= 0)
      return nothing;

    return something(value);
};

var StateMonad = function(value){


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
};

/**
 *
 *
 */
var and = function(){
    return function(user, app_context, app_resource){
        return arguments.reduce(function(acc, curr){
            return acc && curr(user, app_context, app_resource);
        }, true);
    };
};

/**
 *
 *
 */
var or = function(){
    return function(user, app_context, app_resource){
        return arguments.reduce(function(acc, curr){
            return acc || curr(user, app_context, app_resource);
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
        
    
    
    return MaybeMonad(resource);
};


exports.authorize = authorize;
exports.can = can;
exports.cannot = cannot;
exports.and = and;
exports.or = or;
exports.not = not;
exports.revoke = revoke;
exports.override = override;